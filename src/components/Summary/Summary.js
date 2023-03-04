import React from 'react';
import { useDocumentData, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { db } from '../../firebase';
import { doc,} from 'firebase/firestore';
import Feedback from '../Mastermind/Feedback/Feedback';
import MainBoard from '../Mastermind/MainBoard/MainBoard';
import './Summary.css';
import { useNavigate } from 'react-router-dom';
import Board from '../Sudoku/Board/Board';
import MinesweeperBoard from '../Minesweeper/MinesweeperBoard/MinesweeperBoard';

function ConvertTime ({count}) {
  return (
    <div>
      {Math.floor(count/(60 * 60))/*hours*/}
      :
      {Math.floor((count/(60))%60)/*minutes*/}
      :
      {Math.floor(count%60)/*seconds*/}
      :
      {Math.floor(((count)*10)%10)/*milisecs*/}
    </div>
  )
}

const ThisPlayersGame = ({game, thisPlayer, thisPlayerGameStatus}) => {
  switch (game.game) {
    case "mastermind": 
      return (
        <div className='game-summary'>
          <MainBoard gameStatus={thisPlayerGameStatus} isPlaying={false} code={game.code}/>
          <Feedback gameStatus={thisPlayerGameStatus}/>
        </div>
      )
    case "sudoku":
      return (<div className='game-summary'><Board game={game} userId={thisPlayer.uid} isPlaying={false}/></div>);
    case "minesweeper":
      return (<div className='game-summary'><MinesweeperBoard game={game} playerId={thisPlayer.uid} isPlaying={false}/></div>);
    default:
      return <div>GALO</div>
  }
}

const SecondPlayersGame = ({game, secondPlayer, secondPlayerGameStatus}) => {
  switch (game.game) {
    case "mastermind": 
      return (
        <div className='game-summary'>
          <MainBoard gameStatus={secondPlayerGameStatus} isPlaying={false} code={game.code}/>
          <Feedback gameStatus={secondPlayerGameStatus}/>
        </div>
      )
      break;
    case "sudoku":
      return (<div className='game-summary'><Board game={game} userId={secondPlayer.uid} isPlaying={false}/></div>);
    case "minesweeper":
      return (<div className='game-summary'><MinesweeperBoard game={game} playerId={secondPlayer.uid} isPlaying={false}/></div>);
    default:
      return <div>GALO</div>
  }
}

const Summary = ({game, id, thisPlayer, secondPlayer} ) => {
  const navigate = useNavigate();

  const [thisPlayerGameStatus] = useDocumentDataOnce(doc(db, "games", id, "gameStatus", thisPlayer?.uid));
  const [secondPlayerGameStatus] = useDocumentData(doc(db, "games", id, "gameStatus", secondPlayer?.uid));

  const calculateWinner = () => {
    switch (game.game) {
      case 'mastermind':
        if (thisPlayerGameStatus?.feedback && thisPlayerGameStatus.feedback.slice(thisPlayerGameStatus.feedback.length-4).every((value) => value === "black")) {
          if (secondPlayerGameStatus?.feedback && secondPlayerGameStatus.feedback.slice(secondPlayerGameStatus.feedback.length-4).every((value) => value === "black")) {
            return (thisPlayer.finish < secondPlayer.finish ? thisPlayer.name : secondPlayer.name) + " wins by time!";
          }else {
            return thisPlayer.name + " wins! Only he guessed the code";
          }
        }else if (secondPlayerGameStatus?.feedback && secondPlayerGameStatus.feedback.slice(secondPlayerGameStatus.feedback.length-4).every((value) => value === "black")) {
          return secondPlayer.name + " wins! Only he guessed the code";
        }else {
          return "Draw! No one guessed the code";
        }
        break;
      case 'sudoku':
        if (thisPlayerGameStatus?.currentBoard?.indexOf(0)===-1 && thisPlayerGameStatus?.conflicts?.length===0) {
          if (secondPlayerGameStatus?.currentBoard?.indexOf(0)===-1 && secondPlayerGameStatus?.conflicts?.length===0) {
            return (thisPlayer.finish < secondPlayer.finish ? thisPlayer.name : secondPlayer.name) + " wins by time!";
          }else {
            return thisPlayer.name + " wins! Only he solved sudoku";
          }
        }else if (secondPlayerGameStatus?.currentBoard?.indexOf(0)===-1 && secondPlayerGameStatus?.conflicts?.length===0) {
          return secondPlayer.name + " wins! Only he solved sudoku";
        }else {
          return "Draw! No one solved sudoku";
        }
        break;
      case "mastermind":
        if (thisPlayer.didSolveGrid===true) {
          if (secondPlayer.didSolveGrid===true) {
            return (thisPlayer.finish < secondPlayer.finish ? thisPlayer.name : secondPlayer.name) + " wins by time!";
          }
          else { 
            return thisPlayer.name + " wins! Only he solved minesweeper";
          }
        } else {
          if (secondPlayer.didSolveGrid===true) {
            return secondPlayer.name + " wins! Only he solved minesweeper";
          }
          else {
            return "Draw! No one solved minesweeper";
          }
        }
        break;
    }
  }

  return (
    <div>
      Summary
      <div className='summary'>
        <div className='game-summary-container'>
          Your game:
          <ThisPlayersGame game={game} thisPlayer={thisPlayer} thisPlayerGameStatus={thisPlayerGameStatus}/>
          Your time: <ConvertTime count={thisPlayer.finish - game.started-10}/>
        </div>
        <div className='game-summary-container'>
          {secondPlayer?.name}'s game:
          <SecondPlayersGame game={game} secondPlayer={secondPlayer} secondPlayerGameStatus={secondPlayerGameStatus}/>
          {secondPlayer.finish ? <div>{secondPlayer.name}'s time: <ConvertTime count={secondPlayer.finish - game.started-10}/></div> 
          : 
            <div>Waiting for {secondPlayer.name} to finish...</div>
          }
        </div>
      </div>
      <div className='result-container'>
        {secondPlayer.finish &&
          <div className='winner'>{calculateWinner()}</div>
        }
        <div className="new-game" onClick= {() => navigate('/')} >New game</div>
      </div>
    </div>
  )
}

export default Summary;