import React, { useEffect, useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, Timestamp, setDoc, updateDoc} from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import './Game.css';
import Feedback from '../Feedback/Feedback';
import MainBoard from '../MainBoard/MainBoard';
import { LoadingSpinner } from '../../../App';

const Game = ({id, colors}) => {
  const {currentUser} = auth;
  const [game, loading] = useDocumentData(doc(db, "games", id));
  const [gameStatus] = useDocumentData(doc(db, "games", id, "gameStatus", currentUser?.uid));
  const [selectedColor, setSelectedColor] = useState(null);


  const handleCheck = (currentRowColors) => {

    //black - correct collor, correct position
    //white - correct collor, wrong position

    var isTaken = [false, false, false, false]; //to calculate whites
    var result=[];
    //calculate blacks
    for (let i=0; i<4; i++) {
      if (currentRowColors[i]==game.code[i]) {
        result.push("black");
        isTaken[i]=true;
      }
    }
    //calculate whites
    const alreadyAssigned = [...isTaken];
    for (let i=0; i<4; i++) {
      if (!alreadyAssigned[i]) {
        for (let j=0; j<4; j++) {
          if (!isTaken[j] && game.code[j]==currentRowColors[i]) {
            isTaken[j]=true;
            result.push("white");
            break;
          }
        }
      }
    }

    for (let i=result.length; i<4; i++) {
      result.push("darkgray");
    }

    //update gameStatus
    var updatedAttempts = gameStatus?.attempts;
    var updatedFeedback = gameStatus?.feedback;
    if (updatedAttempts) {
      updatedAttempts = updatedAttempts.concat(currentRowColors);
    } else {
      updatedAttempts = currentRowColors;
    }
    if (updatedFeedback) {
      updatedFeedback = updatedFeedback.concat(result);
    } else {
      updatedFeedback = result;
    }

    setDoc(doc(db, "games", id, "gameStatus", currentUser.uid), {attempts: updatedAttempts, feedback: updatedFeedback});

    //if player finished
    const playerWon = result.every((value) => value === "black");
    if (playerWon || updatedAttempts.length==40) {
      endTheGame();
    } 
  }

  const endTheGame = () => {
    const finish = Timestamp.fromDate(new Date());
    const updatedMembers= game.members;
    for (let i=0; i<2; i++) {
      if (updatedMembers[i].uid == currentUser.uid) {
        updatedMembers[i].finish = finish;
        updateDoc(doc(db, "games", id), {members: updatedMembers});
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <div className='board-container'>
        <div className='colors-to-select'>
            <div className='select-label'>Select color:</div>
            <select id="select-color" multiple onChange={(e) => setSelectedColor(e.target.value)}>
              {colors?.map((color, i) => (
                  <option key={i} value={color} style={{backgroundColor: color}}>{color}</option>
              ))}
            </select>
        </div>
        <MainBoard gameStatus={gameStatus} onCheck={handleCheck} selectedColor={selectedColor} isPlaying={true}/>
        <Feedback gameStatus={gameStatus}/>
      </div>
      <br/>
      <div className='end' onClick={() => endTheGame()}>Surrender</div>
    </>
  )
}

export default Game;