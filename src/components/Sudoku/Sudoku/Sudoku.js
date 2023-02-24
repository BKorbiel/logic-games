import React, { useEffect, useState } from 'react';
import CountDown from '../../CountDown';
import { LoadingSpinner } from '../../../App';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { setNewBoard } from '../Logic/Logic';
import Board from '../Board/Board';
import './Sudoku.css';

const Sudoku = ({id}) => {
  const {currentUser} = auth;
  const [game, loading] = useDocumentData(doc(db, "games", id));
  const [selectedNumber, setSelectedNumber] = useState(null);

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
  }, [game]);

  if (loading) {
    return <LoadingSpinner/>
  }


  return (
    <div>
      <div><CountDown startDate={game.started}/></div>
      <div><Board game={game} gameId={id} userId={currentUser.uid} selectedNumber={selectedNumber}/></div>
      <br/>
      <div className='numbers-container'>
        {Array(9).fill(null).map((v, i) => (
          <div key={i} className={i+1 == selectedNumber ? 'selected-number' : 'number-to-select'} onClick={() => setSelectedNumber(i+1)}>
            {i+1}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sudoku;