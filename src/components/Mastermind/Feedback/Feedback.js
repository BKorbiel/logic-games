import React, { useEffect, useState } from 'react';
import './Feedback.css';

const Feedback = ({gameStatus}) => {
    const [feedback, setFeedback] = useState(() => Array.from({ length: 40 }, () => null));

    useEffect(() => {
        if (gameStatus?.feedback) {
            setFeedback(gameStatus.feedback.concat(Array(40-gameStatus.feedback.length).fill(null)));
          }
    }, [gameStatus]);

    return (
        <div className='feedback-board'>
            {feedback.map((val, i) =>(
                <div key={i} className='feedback'>
                    <div className='feedback-color' style={{backgroundColor: val}}></div>
                </div>
            ))}
            {Array(8).fill(null).map((v, i) => (<div key={i} className='feedback'></div>))}
        </div>
    )
}

export default Feedback;