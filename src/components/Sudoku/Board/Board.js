import React from 'react'
import './Board.css';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../../../firebase';
import { doc } from 'firebase/firestore';

const Board = ({game, gameId, userId, selectedNumber}) => {
    const [gameStatus] = useDocumentData(doc(db, "games", gameId, "gameStatus", userId));

    const setStyle = (position) => {
        let style = {};
        if (position%3===2) {
            style.borderRight = "3px solid black";
        }
        if (Math.floor(position/9)%3==2) {
            style.borderBottom = "3px solid black";
        }
        if (gameStatus.currentBoard[position]===0) {
            style = {...style, cursor: "pointer"};
        }
        else if (game.startingBoard[position]===0) {
            style.color = "blue";
        }
        return style;
    }

    return (
        <div className='sudoku-board' style={{fontSize: 20}}>
            {gameStatus?.currentBoard?.map((cell, i) => (
                <div 
                    key={i} 
                    className='cell' 
                    style={setStyle(i)}>
                        {cell!=0 ? cell : ""}
                </div>
            ))}
        </div>
    )
}

export default Board;
