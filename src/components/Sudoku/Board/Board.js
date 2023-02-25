import React from 'react'
import './Board.css';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getConflicts } from '../Logic/Logic';

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
        if (gameStatus.conflicts && gameStatus.conflicts.includes(position)) {
            style.backgroundColor = "rgb(231, 126, 126)";
        }

        if (gameStatus.currentBoard[position]===0) {
            if (selectedNumber!=0) {
                style.cursor= "pointer";
            }
        }
        else if (game.startingBoard[position]===0) {
            style.color = "blue";
            if (selectedNumber===0) {
                style.cursor="pointer";
            }
        }

        return style;
    }

    const handleClick = (position) => {
        if (selectedNumber===0) { //clear button is selected
            if (gameStatus.currentBoard[position]!=0 && game.startingBoard[position]===0) {
                
                //removing conflicts
                let updatedConflicts = gameStatus.conflicts;
                const prevConflicts = getConflicts(position, gameStatus.currentBoard, gameStatus.currentBoard[position]);
                if (prevConflicts.length!=0){
                    prevConflicts.forEach((val) => {
                        let ind = updatedConflicts.indexOf(val);
                        updatedConflicts.splice(ind, 1);
                    })
                }
                updatedConflicts = updatedConflicts.filter((val) => {return val!=position});

                const newBoard = gameStatus.currentBoard;
                newBoard[position] = 0;

                updateDoc(doc(db,"games", gameId, "gameStatus", userId), {currentBoard: newBoard, conflicts: updatedConflicts});
            }
        }
        else {
            if (gameStatus.currentBoard[position]===0) {
                const newBoard = gameStatus.currentBoard;
                newBoard[position] = selectedNumber;
                const newConflicts = getConflicts(position, gameStatus.currentBoard, selectedNumber);
                const len = newConflicts.length;
                for (let i=0; i<len; i++){
                    newConflicts.push(position);
                }

                if (gameStatus.conflicts) {
                    updateDoc(doc(db,"games", gameId, "gameStatus", userId), {currentBoard: newBoard, conflicts: gameStatus.conflicts.concat(newConflicts)});
                } else {
                    updateDoc(doc(db,"games", gameId, "gameStatus", userId), {currentBoard: newBoard, conflicts: newConflicts});
                }
            }
        }

    }
    return (
        <div className='sudoku-board' style={{fontSize: 20}}>
            {gameStatus?.currentBoard?.map((cell, i) => (
                <div 
                    key={i}
                    onClick={() => handleClick(i)}
                    className='cell' 
                    style={setStyle(i)}>
                        {cell!=0 ? cell : ""}
                </div>
            ))}
        </div>
    )
}

export default Board;
