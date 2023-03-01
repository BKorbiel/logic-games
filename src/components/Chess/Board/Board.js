import React, {useState} from 'react'
import './Board.css';
import { doc, updateDoc, setDoc, Timestamp } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../../../firebase';
import $ from 'jquery';
import isLegalMove, {isCheck, isCheckMate, isDraw, assignCastles, assignEnpassant} from '../Logic';

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

const Promotion = ({color, handlePromotion}) => {
  return (
    <div className='promotion'>
      <div className='piece' style={{backgroundImage: `url(${require(`./assets/${color}_rook.png`)})`}} onClick={() => handlePromotion("rook")}></div>
      <div className='piece' style={{backgroundImage: `url(${require(`./assets/${color}_queen.png`)})`}} onClick={() => handlePromotion("queen")}></div>
      <div className='piece' style={{backgroundImage: `url(${require(`./assets/${color}_knight.png`)})`}} onClick={() => handlePromotion("knight")}></div>
      <div className='piece' style={{backgroundImage: `url(${require(`./assets/${color}_bishop.png`)})`}} onClick={() => handlePromotion("bishop")}></div>
    </div>
  )
}


const Board = ({gameId, thisPlayer, onGameOver}) => {
  const [game] = useDocumentData(doc(db, "games", gameId));
  const [moveFrom, setMoveFrom] = useState();
  const [movingPiece, setMovingPiece] = useState();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isPromotion, setIsPromotion] = useState([]); //[moveFrom, moveTo]


  const grabPiece = (e) => {
    const pos = e.target.id;
    if (!game.gameOver && game?.currentBoard[pos]?.length && game.currentBoard[pos].substr(0, 5)===thisPlayer.color && game.currentMove === thisPlayer.color) {

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
        let updatedGame = {...game};
        
        //castles
        assignCastles(updatedGame, moveFrom, pos);

        //enpassant
        assignEnpassant(updatedGame, moveFrom, pos);

        //is promotion?
        if (updatedGame.currentBoard[moveFrom].substr(6)==="pawn" && (Math.floor(pos/8)===7 || Math.floor(pos/8)===0)) {
          setIsPromotion([moveFrom, pos]);
          movingPiece.style.position = "relative";
          movingPiece.style.removeProperty("top");
          movingPiece.style.removeProperty("left");
        } else {
          updatedGame.currentBoard[pos] = updatedGame.currentBoard[moveFrom];
          updatedGame.currentBoard[moveFrom] = "";
          updatedGame.currentMove = game.currentMove === "white" ? "black" : "white";
          for (let i=0; i<2; i++) {
            if (updatedGame.members[i].uid===thisPlayer.uid) {
              updatedGame.members[i].leftTime = updatedGame.members[i].leftTime-(Timestamp.fromDate(new Date())-updatedGame.members[i].moveFromTime);
            }
            else {
              updatedGame.members[i].moveFromTime = Timestamp.fromDate(new Date());
            }
          }
          setDoc(doc(db, "games", gameId), updatedGame);
          if (isCheckMate(updatedGame.currentBoard, updatedGame.currentMove, updatedGame.enpassant)) {
            onGameOver(game, `${thisPlayer.name} wins by checkmate!`);
          } 
          const draw = isDraw(updatedGame.currentBoard, updatedGame.currentMove, updatedGame.enpassant);
          if (draw) {
            onGameOver(game, draw);
          }
        }

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

  const handlePromotion = (piece) => {
    const from = isPromotion[0];
    const to = isPromotion[1];
    const newBoard = [...game.currentBoard];
    newBoard[from]="";
    newBoard[to]=`${game.currentMove}_${piece}`;
    const nextMove = game.currentMove === "white" ? "black" : "white";
    const updatedMembers = game.members;
    for (let i=0; i<2; i++) {
      if (updatedMembers[i].uid===thisPlayer.uid) {
        updatedMembers[i].leftTime = updatedMembers[i].leftTime-(Timestamp.fromDate(new Date())-updatedMembers[i].moveFromTime);
      }
      else {
        updatedMembers[i].moveFromTime = Timestamp.fromDate(new Date());
      }
    }
    if (isCheckMate(newBoard, nextMove, -1)) {
      onGameOver(game, `${thisPlayer.name} wins by checkmate!`);
    } 
    const draw = isDraw(newBoard, nextMove, -1);
    if (draw) {
      onGameOver(game, draw);
    }
    updateDoc(doc(db, "games", gameId), {currentBoard: newBoard, members: updatedMembers, currentMove: nextMove, enpassant: -1});

    setIsPromotion([]);
  }

  const setPieceStyle = (pos) => {
    let style={
      backgroundImage: `url(${require(`./assets/${game.currentBoard[pos]}.png`)})`
    };
    if (!game.gameOver && game.currentBoard[pos].substr(0, 5)===thisPlayer.color && game.currentMove===thisPlayer.color) {
      style={...style, cursor: isMouseDown ? 'grabbing' : 'grab'}
    }
    return style;
  }

  const setSquareStyle = (pos) => {
    let style = {};
    if (game.currentBoard[pos]==`${game.currentMove}_king`) {
      if (isCheckMate(game.currentBoard, game.currentMove, game.enpassant)) {
        style = {backgroundColor: "red"};
      }
      else if (isCheck(game.currentBoard, game.currentMove)) {
        style = {border: "2px solid red"};
      }
    }
    if (thisPlayer.color===game.currentMove && isMouseDown) { 
      if (isLegalMove(game.currentBoard, moveFrom, pos, game.castles, game.enpassant)) {
        style={...style, backgroundColor: "lightgreen"}
      }
      if (moveFrom===pos) {
        style = {...style, backgroundColor: "lightyellow"};
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
      {isPromotion?.length!=0 && <Promotion color={game.currentMove} handlePromotion={handlePromotion}/>}
    </div>
  )
}

export default Board;
