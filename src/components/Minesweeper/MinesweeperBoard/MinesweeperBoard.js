import React, { useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import './MinesweeperBoard.css';
import { didPlayerWin, getCellsToReveal } from '../Logic';

const MinesweeperBoard = ({game, player, onGameOver, isPlaying}) => {
    const [clickedBomb, setClickedBomb] = useState(null);
    const [gameStatus] = useDocumentData(doc(db, "games", game.gameId, "gameStatus", player?.uid));


    const checkCell = (position) => {
        if (gameStatus.playerBoard[position]===0 && isPlaying && clickedBomb===null) {
            let updatedBoard = [...gameStatus.playerBoard];
            if (game.grid[position]===9) { //game over, player clicked on the bomb
                setClickedBomb(position);
                setTimeout(() => onGameOver(false), 2000);
            }
            else if (game.grid[position]===0) { //player clicked empty position
                let cellsToReveal = getCellsToReveal(game.grid, game.rowCount*game.colCount, game.colCount, position);
                cellsToReveal.forEach((position) => {
                    if (game.grid[position]===0) {
                        updatedBoard[position]=11; //11 is checked empty cell code
                    } else {
                        updatedBoard[position] = game.grid[position];
                    }
                });
                updateDoc(doc(db, "games", game.gameId, "gameStatus", player.uid), {playerBoard: updatedBoard});
                if (didPlayerWin(game.grid, updatedBoard)) {
                    onGameOver(true);
                } 

            } else {
                updatedBoard[position]=game.grid[position];
                updateDoc(doc(db, "games", game.gameId, "gameStatus", player.uid), {playerBoard: updatedBoard});
                if (didPlayerWin(game.grid, updatedBoard)) {
                    onGameOver(true);
                } 
            }
        }
    }
    //10 is cell with flag code
    const flagCell = (e, position) => {
        if (isPlaying) {
            e.preventDefault();
            if (gameStatus.playerBoard[position]===0) {
                let updatedBoard = [...gameStatus.playerBoard];
                updatedBoard[position]=10;
                updateDoc(doc(db, "games", game.gameId, "gameStatus", player.uid), {playerBoard: updatedBoard, flagsCount: gameStatus.flagsCount+1});
            } else if(gameStatus.playerBoard[position]===10) {
                let updatedBoard = [...gameStatus.playerBoard];
                updatedBoard[position]=0;
                updateDoc(doc(db, "games", game.gameId, "gameStatus", player.uid), {playerBoard: updatedBoard, flagsCount: gameStatus.flagsCount-1});
            }
        }
    }

    const setCellStyle = (cell) => {
        let style={}
        if (cell!=0 && cell!=10) {
            style.backgroundColor = "lightgrey";
            switch (cell) {
                case 1:
                    style.color="blue";
                    break;
                case 2:
                    style.color="green";
                    break;
                case 3:
                    style.color="red";
                    break;
                case 4:
                    style.color="purple";
                    break;
                case 5:
                    style.color="maroon";
                    break;
                case 6:
                    style.color="turquoise";
                    break;
                case 7:
                    style.color="black";
                    break;
                case 8:
                    style.color="gray";
                    break;
            }
        }
        return style;
    }

    return (
        <div className='minesweeper-board' style={{maxWidth: 18*game.colCount}}>
            <div className='bomb-count' style={{width: "100%"}}>
                <img src={require('./assets/flag.png')} alt="flag"/>
                {game.bombsCount - gameStatus?.flagsCount}
            </div>
            {gameStatus?.playerBoard.map((cell, i) =>
                (isPlaying===false && player.finish && game.grid[i]===9 && cell!=10 || clickedBomb===i) ?
                    (<div key={i} className="revealed-bomb">
                        <img className="bomb-img" src={require('./assets/bomb.png')} alt="bomb"/>
                    </div>)
                :
                    (<div 
                        key={i} 
                        className={`minesweeper-cell${((cell===0 || cell===10) && isPlaying) ? " cell-to-hover" : ""}`} 
                        onClick={() => checkCell(i)} onContextMenu={(e) => flagCell(e, i)}
                        style={setCellStyle(cell)}
                    >
                        {(cell!=0 && cell!=11) && 
                            (cell===10 ? <img className="flag-img" src={require('./assets/flag.png')} alt="flag"/>
                            :
                            cell
                            )
                        }
                    </div>)
                
            )}
        </div>
    )
}

export default MinesweeperBoard;