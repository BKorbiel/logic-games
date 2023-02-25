import React, { useEffect, useState } from 'react';
import CountDown from '../../CountDown';
import { LoadingSpinner } from '../../../App';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { setNewBoard } from '../Logic/Logic';
import Board from '../Board/Board';
import './Sudoku.css';
import { ClearOutlined } from '@ant-design/icons';
import Summary from '../Summary/Summary';

const Sudoku = ({id}) => {
  const {currentUser} = auth;
  const [game, loading] = useDocumentData(doc(db, "games", id));
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [thisPlayerFinished, setThisPlayerFinished] = useState(false);
  const [secondPlayerFinished, setSecondPlayerFinished] = useState(false);

  useEffect(() => {
    if (game && !game.startingBoard) {
      const creator = game.members.find(m => m.creator === true);
      if (currentUser.uid==creator.uid) {

        const board = setNewBoard();
        updateDoc(doc(db, "games", id), {startingBoard: board});

        game.members.forEach(member => {
          setDoc(doc(db, "games", id, "gameStatus", member.uid), {currentBoard: board});
        });

      }
    }

    for (let i=0; i<2; i++) {
      if (game?.members[i]?.finish && currentUser?.uid) {
        if (game.members[i].uid==currentUser.uid) {
          setThisPlayerFinished(true);
        }
        else {
          setSecondPlayerFinished(true);
        }
      }
    }
  }, [game]);

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
    return <LoadingSpinner/>
  }


  return (
    <div>
      <div><CountDown startDate={game.started}/></div>
      <div><Board game={game} gameId={id} userId={currentUser.uid} selectedNumber={selectedNumber} onFinish={endTheGame}/></div>
      <br/>
      <div className='numbers-container'>
        {Array(9).fill(null).map((v, i) => (
          <div key={i} className={i+1 === selectedNumber ? 'selected-number' : 'number-to-select'} onClick={() => setSelectedNumber(i+1)}>
            {i+1}
          </div>
        ))}
        <div className={selectedNumber === 0 ? 'selected-number' : 'number-to-select'} onClick={() => setSelectedNumber(0)}>
          <ClearOutlined/>
        </div>
      </div>
      <div onClick={() => endTheGame()}>End the game</div>
    </div>
  )
}

export default Sudoku;