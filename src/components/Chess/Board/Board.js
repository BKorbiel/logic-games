import React, {useState} from 'react'
import './Board.css';
import { doc, updateDoc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../../../firebase';
import $ from 'jquery';

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
  return position;
}


const Board = ({gameId, thisPlayer}) => {
  const [game] = useDocumentData(doc(db, "games", gameId));
  const [moveFrom, setMoveFrom] = useState();
  const [movingPiece, setMovingPiece] = useState();
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  const grabPiece = (e) => {
    const pos = e.target.id;
    if (game?.currentBoard[pos]?.length && game.currentBoard[pos].substr(0, 5)===thisPlayer.color) {

      setMoveFrom(pos);
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
      if (pos && moveFrom!=pos) {
        let newBoard = game.currentBoard;
        newBoard[pos] = newBoard[moveFrom];
        newBoard[moveFrom] = "";
        updateDoc(doc(db, "games", gameId), {currentBoard: newBoard});

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

  const setStyle = (pos) => {
    let style={
      backgroundImage: `url(${require(`./assets/${game.currentBoard[pos]}.png`)})`
    };
    if (game.currentBoard[pos].substr(0, 5)===thisPlayer.color) {
      style={...style, cursor: isMouseDown ? 'grabbing' : 'grab'}
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
        <div key={i} id={i} className={(i%8+Math.floor(i/8))%2==0 ? "white-square" : "black-square"}>
          {square!="" &&
            <div className='piece' id={i} style={setStyle(i)}>
            </div>
          }
        </div>
      ))
      :
      game?.currentBoard?.map((square, i) => (
        <div key={i} id={i} className={(i%8+Math.floor(i/8))%2==0 ? "white-square" : "black-square"}>
          {square!="" &&
            <div className='piece' id={i} style={setStyle(i)}>
            </div>
          }
        </div>
      )).reverse()
      }
    </div>
  )
}

export default Board;
