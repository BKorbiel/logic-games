import React, { useEffect, useState } from 'react';
import { useDocumentData, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { db } from '../../../firebase';
import { doc, Timestamp } from 'firebase/firestore';
import Feedback from '../Feedback/Feedback';
import MainBoard from '../MainBoard/MainBoard';
import './Summary.css';
import { useNavigate } from 'react-router-dom';

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

const Summary = ({game, id, thisPlayer, secondPlayer} ) => {
  const navigate = useNavigate();

  const [thisPlayerGameStatus] = useDocumentDataOnce(doc(db, "games", id, "gameStatus", thisPlayer?.uid));
  const [secondPlayerGameStatus] = useDocumentData(doc(db, "games", id, "gameStatus", secondPlayer?.uid));

  const calculateWinner = () => {
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
  }

  return (
    <div>
      Summary
      <div className='summary'>
        <div className='game-summary-container'>
          Your game:
          <div className='game-summary'>
            <MainBoard gameStatus={thisPlayerGameStatus} isPlaying={false} code={game.code}/>
            <Feedback gameStatus={thisPlayerGameStatus}/>
          </div>
          Your time: <ConvertTime count={thisPlayer.finish - game.started-10}/>
        </div>
        <div className='game-summary-container'>
          {secondPlayer?.name}s game:
          <div className='game-summary'>
            <MainBoard gameStatus={secondPlayerGameStatus} isPlaying={false} code={game.code}/>
            <Feedback gameStatus={secondPlayerGameStatus}/>
          </div>
          {secondPlayer.finish ? <div>{secondPlayer.name}s time: <ConvertTime count={secondPlayer.finish - game.started-10}/></div> 
          : 
            <div>Waiting for {secondPlayer.name} to finish...</div>
          }
        </div>
        <div>
          {secondPlayer.finish &&
            <div>{secondPlayer.finish && calculateWinner()}</div>
          }
          <div onClick= {() => navigate('/')} >New game</div>
        </div>
      </div>
    </div>
  )
}

export default Summary;