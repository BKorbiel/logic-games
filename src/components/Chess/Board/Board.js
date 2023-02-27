import React, {useState} from 'react'
import './Board.css';
import { doc, updateDoc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../../../firebase';
import $ from 'jquery';
import isLegalMove, {isCheck} from '../Logic';

function getPosition(x,y){
  let position = null;
  $('.white-square, .black-square').each(function(i, obj){
      let left = $(obj).offset().left;
      let right= $(obj).offset().left + $(obj).width();
      let top = $(obj).offset().top;
      let bottom = $(obj).offset().top + $(obj).height();

      if (x >= left && x <= right) {
          if (y >= top && y <= bottom) {
              position = $(obj).attr('id');
              return;
          }
      }
  });
  return parseInt(position);
}


const Board = ({gameId, thisPlayer}) => {
  const [game] = useDocumentData(doc(db, "games", gameId));
  const [moveFrom, setMoveFrom] = useState();
  const [movingPiece, setMovingPiece] = useState();
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  const grabPiece = (e) => {
    const pos = e.target.id;
    if (game?.currentBoard[pos]?.length && game.currentBoard[pos].substr(0, 5)===thisPlayer.color && game.currentMove === thisPlayer.color) {

      setMoveFrom(parseInt(pos));
      setMovingPiece(e.target);

      const x = e.clientX - 35;
      const y = e.clientY - 35;
      e.target.style.position = "absolute";
      e.target.style.left = `${x}px`;
      e.target.style.top = `${y}px`;
      setIsMouseDown(true);
    }
  }

  const movePiece = (e) => {
    if (movingPiece) {
      const x = e.clientX - 35;
      const y = e.clientY - 35;
      movingPiece.style.position = "absolute";

      movingPiece.style.left = `${x}px`;
      movingPiece.style.top = `${y}px`;

    }
  }

  const dropPiece = (e) => {
    if (movingPiece) {
      const pos = getPosition(e.clientX, e.clientY);
      if (pos!=null && moveFrom!=pos && isLegalMove(game.currentBoard, moveFrom, pos, game.castles, game.enpassant)) {
        let newBoard = game.currentBoard;
        
        //castles ***********************
        if (moveFrom===4 && pos===2 && newBoard[moveFrom]==="black_king") {
          newBoard[3]="black_rook";
          newBoard[0]="";
        }
        if (moveFrom===4 && pos===6 && newBoard[moveFrom]==="black_king") {
          newBoard[5]="black_rook";
          newBoard[7]="";
        }
        if (moveFrom===60 && pos===58 && newBoard[moveFrom]==="white_king") {
          newBoard[59]="white_rook";
          newBoard[56]="";
        }
        if (moveFrom===60 && pos===62 && newBoard[moveFrom]==="white_king") {
          newBoard[61]="white_rook";
          newBoard[63]="";
        }
        let updatedCastles = game.castles;
        if (game.castles.blackLeftCastle && (moveFrom===0 || moveFrom===4 || pos===0)) {
          updatedCastles.blackLeftCastle = false;
        }
        if (game.castles.blackRightCastle && (moveFrom===7 || moveFrom===4 || pos===7)) {
          updatedCastles.blackRightCastle = false;
        }
        if (game.castles.whiteLeftCastle && (moveFrom===56 || moveFrom===60 || pos===56)) {
          updatedCastles.whiteLeftCastle = false;
        }
        if (game.castles.whiteRightCastle && (moveFrom===63 || moveFrom===60 || pos===63)) {
          updatedCastles.whiteRightCastle = false;
        }
        //*******************************

        //enpassant
        if (newBoard[moveFrom]==="white_pawn" && game.enpassant-8===pos) {
          newBoard[game.enpassant]="";
        }
        if (newBoard[moveFrom]==="black_pawn" && game.enpassant+8===pos) {
          newBoard[game.enpassant]="";
        }
        let enpassant;
        if (newBoard[moveFrom].substr(6)==="pawn" && (moveFrom+16===pos || moveFrom-16===pos)) {
          enpassant=pos;
        } else {
          enpassant=-1;
        }


        newBoard[pos] = newBoard[moveFrom];
        newBoard[moveFrom] = "";
        const nextMove = game.currentMove === "white" ? "black" : "white";
        
        updateDoc(doc(db, "games", gameId), {currentBoard: newBoard, currentMove: nextMove, castles: updatedCastles, enpassant: enpassant});
        
      } else {
        movingPiece.style.position = "relative";
        movingPiece.style.removeProperty("top");
        movingPiece.style.removeProperty("left");
      }

      setMoveFrom(null);
      setMovingPiece(null);
      setIsMouseDown(false);
    }
  }

  const setPieceStyle = (pos) => {
    let style={
      backgroundImage: `url(${require(`./assets/${game.currentBoard[pos]}.png`)})`
    };
    if (game.currentBoard[pos].substr(0, 5)===thisPlayer.color && game.currentMove===thisPlayer.color) {
      style={...style, cursor: isMouseDown ? 'grabbing' : 'grab'}
    }
    return style;
  }

  const setSquareStyle = (pos) => {
    let style = {};
    if (isCheck(game.currentBoard, game.currentMove) && game.currentBoard[pos]==`${game.currentMove}_king`) {
      style = {border: "2px solid lightred"};
    }
    if (thisPlayer.color===game.currentMove && isMouseDown) { 
      if (isLegalMove(game.currentBoard, moveFrom, pos, game.castles, game.enpassant)) {
        console.log(game.enpassant);
        style={...style, border: "1px solid green"}
      }
      if (moveFrom===pos) {
        style = {...style, opacity: 0.5};
      }
    }
    return style;
  }

  return (
    <div 
      className='chess-board' 
      onMouseDown={(e) => grabPiece(e)}
      onMouseMove={(e) => movePiece(e)}
      onMouseUp={(e) => dropPiece(e)}
    >
      {thisPlayer.color==="white" ?
      game?.currentBoard?.map((square, i) => (
        <div key={i} id={i} style={setSquareStyle(i)} className={(i%8+Math.floor(i/8))%2==0 ? "white-square" : "black-square"}>
          {square!="" &&
            <div className='piece' id={i} style={setPieceStyle(i)}>
            </div>
          }
        </div>
      ))
      :
      game?.currentBoard?.map((square, i) => (
        <div key={i} id={i} style={setSquareStyle(i)} className={(i%8+Math.floor(i/8))%2==0 ? "white-square" : "black-square"}>
          {square!="" &&
            <div className='piece' id={i} style={setPieceStyle(i)}>
            </div>
          }
        </div>
      )).reverse()
      }
    </div>
  )
}

export default Board;
