import React, {useEffect, useState} from 'react';
import Game from './Game/Game';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import Summary from './Summary/Summary';

const CountDown = ({startDate}) => {
  const [counter, setCounter] = useState(Timestamp.fromDate(new Date()) - startDate-10);

  useEffect(() => {
    setTimeout(() => setCounter(Timestamp.fromDate(new Date()) - startDate-10), 100);
  }, [counter, startDate]);

  return (
    <div>
      {counter &&
        <div>
          Your time: <br/>
          {Math.floor(counter/(60 * 60)) /*hours*/}
          :
          {Math.floor((counter/(60))%60) /*minutes*/}
          :
          {Math.floor(counter%60) /*seconds*/}
          :
          {Math.floor(((counter)*10)%10) /*milisecs*/}
        </div>
      }
    </div>
  );
}

//10 rows, 4 columns
//easy - 4 colors
//normal - 6 colors
//hard - 8 colors
const Mastermind = ({id}) => {
  const { currentUser } = auth;
  const [colors, setColors] = useState(["blue", "green", "yellow", "red"]);
  const [game] = useDocumentData(doc(db, "games", id));
  const [thisPlayerFinished, setThisPlayerFinished] = useState(false);
  const [secondPlayerFinished, setSecondPlayerFinished] = useState(false);

  useEffect(() => {
    if (game?.difficulty == "normal") {
      setColors(["blue", "green", "yellow", "red", "pink", "orange"]);
    }
    if (game?.difficulty == "hard") {
      setColors(["blue", "green", "yellow", "red", "pink", "orange", "brown", "purple"]);
    }

    //setting code
    if (game && !game.code) {
      const creator = game.members.find(m => m.creator === true);
      if (currentUser.uid==creator.uid) {
        var code = [];
        for (let i=0; i<4; i++) {
          code.push(colors[Math.floor(Math.random() * colors.length)]); 
        }
        updateDoc(doc(db, "games", id), {code: code});
        game.code=code;
      }
    }

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

  return (
    <div>
      <div>Mastermind</div>
      {thisPlayerFinished ? <Summary game={game} id={id} thisPlayer={game.members.find(m => m.uid === currentUser.uid)} secondPlayer={game.members.find(m => m.uid != currentUser.uid)}/>
      :
        <>
          <div><CountDown startDate={game?.started || 0}/></div>
          {secondPlayerFinished && <div>The other player has already finished the game</div>}
          <div><Game id={id} colors={colors}/></div>
        </>
    }
    </div>
    )
}

export default Mastermind;
