import React , {useState, useEffect} from 'react';
import './MainBoard.css';

const MainBoard = ({gameStatus, onCheck, selectedColor, isPlaying, code}) => {
    const [attempts, setAttempts] = useState(() => Array.from({ length: 40 }, () => null));
    const [currentRow, setCurrentRow] = useState(0);
    const [currentRowColors, setCurrentRowColors] = useState(["darkgray", "darkgray", "darkgray", "darkgray"]);

    useEffect(() => {
        if (gameStatus?.attempts){
            setAttempts(gameStatus.attempts.concat(Array(40-gameStatus.attempts.length).fill(null)));
            setCurrentRow(Math.floor(gameStatus.attempts.length/4));
        }
    }, [gameStatus])

    const handleClick = (i, j) => {
        if (isPlaying && currentRow==i && selectedColor) {
            const newCurrentRowColors = [...currentRowColors];
            newCurrentRowColors[j]=selectedColor;
            setCurrentRowColors(newCurrentRowColors);
        }
    }

    const handleCheck = () => {
        onCheck(currentRowColors);
        setCurrentRow(currentRow+1);
        setCurrentRowColors(["darkgray", "darkgray", "darkgray", "darkgray"]);
    }
    return (
        <div className='bambo'>
            <div className='board'>
                {attempts.map((color, i) =>(
                    <div key={i} onClick={() => handleClick(Math.floor(i/4), i%4)} className='color-container'>
                        <div className='color' style={{backgroundColor: Math.floor(i/4)==currentRow ? currentRowColors[i%4] : color}}></div>
                    </div>
                ))}
                <div className='color-container'></div>
                <div className='color-container'></div>
                <div className='color-container'></div>
                <div className='color-container'></div>
                {isPlaying ? 
                    Array(4).fill(null).map((val, i) => (
                        <div key={i} className='color-container'>
                            <div className='color'></div>
                        </div>
                    ))
                :
                    code.map((color, i) => (
                        <div key={i} className='color-container'>
                            <div className='color' style={{backgroundColor: color}}></div>
                        </div>
                    ))
                }
            </div>
            {isPlaying && <div className='Check' onClick={() => handleCheck()}>Check</div>}
        </div>
    )
}

export default MainBoard;