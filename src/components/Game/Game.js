import React from 'react'
import { useParams } from 'react-router-dom';
import Chat from '../Chat/Chat';
import './Game.css';

const Game = () => {
    const {id} = useParams();

    return (
        <div className='game-app'>
            {id}
            <div className='chat-app'>
                Chat
                <Chat id={id}/>
            </div>
        </div>
    )
}

export default Game;