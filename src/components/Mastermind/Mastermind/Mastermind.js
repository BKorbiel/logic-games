import React, {useEffect, useState} from 'react';
import Game from '../Game/Game';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import Summary from '../../Summary/Summary';
import './Mastermind.css';
import CountDown from '../../CountDown.js';
import { LoadingSpinner } from '../../../App';

//10 rows, 4 columns
//easy - 4 colors
//normal - 6 colors
//hard - 8 colors
const Mastermind = ({id}) => {
  const { currentUser } = auth;
  const [game, loading] = useDocumentData(doc(db, "games", id));
  const [thisPlayerFinished, setThisPlayerFinished] = useState(false);
  const [secondPlayerFinished, setSecondPlayerFinished] = useState(false);

  useEffect(() => {
    for (let i=0; i<2; i++) {
      if (game?.members[i]?.finish) {
        if (game?.members[i].uid==currentUser?.uid) {
          setThisPlayerFinished(true);
        }
        else {
          setSecondPlayerFinished(true);
        }
      }
    }
  }, [game]);

  if (loading) {
    <LoadingSpinner/>
  }

  return (
    <div className='mastermind'>
      {thisPlayerFinished ? <Summary game={game} id={id} thisPlayer={game.members.find(m => m.uid === currentUser.uid)} secondPlayer={game.members.find(m => m.uid != currentUser.uid)}/>
      :
        <div className='container'>
          <div className='countdown'><CountDown startDate={game?.started || 0}/></div>
          <div><Game id={id} colors={game?.colors}/></div>
          {secondPlayerFinished && <div className='info'>The second player has already finished the game</div>}
        </div>
    }
    </div>
    )
}

export default Mastermind;
