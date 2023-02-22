import React, { useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc} from 'firebase/firestore';
import { db } from '../../firebase';
import './GameBoard.css';

const GameBoard = ({id, colors}) => {
  const [game] = useDocumentData(doc(db, "games", id));
  const [attempts, setAttempts] = useState(() => Array.from({ length: 10 }, () => [null, null, null, null]));
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentRow, setCurrentRow] = useState(9);

  const handleClick = (i, j) => {
    if (currentRow==i && selectedColor) {
      const newAttempts = [...attempts];
      newAttempts[i][j]=selectedColor;
      setAttempts(newAttempts);
    }
  }

  return (
    <div className='board-container'>
      <div className='colors'>
        Select color:
        {colors.map((color, i) => (
          <div 
            onClick={() => setSelectedColor(color)} 
            key={i} 
            className="color-container"
          >
              <div className={selectedColor==color ? "selected-color" : "color"} style={{backgroundColor: color}}></div>
          </div>
        ))}
      </div>
      <div className='board'>
        <div className='code'>
          {Array(4).fill(null).map((val, i) => (
            <div key={i} className='color-container'>
              <div className='color'></div>
            </div>
          ))}
        </div>
        <div className='row'>
          <div className='color-container'></div>
          <div className='color-container'></div>
          <div className='color-container'></div>
          <div className='color-container'></div>
        </div>
        {attempts.map((row, i) => (
          <div key={i} className='row'>
            {row.map((val, j) => (
              <div key={i*10+j} onClick={() => handleClick(i, j)} className='color-container'>
                <div className='color' style={{backgroundColor: attempts[i][j]}}></div>
              </div>
            ))}
          </div>
        ))}
        <div className='Check'>Check</div>
      </div>
      <div className='feedback'>

      </div>
    </div>
  )
}

export default GameBoard;