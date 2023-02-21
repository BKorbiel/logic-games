import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Chat from '../Chat/Chat';
import './Game.css';
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from '../../firebase';
import Mastermind from '../Mastermind/Mastermind';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useNavigate } from 'react-router-dom';

const CountDown = ({onStart}) => {
    const [counter, setCounter] = useState(10);
    React.useEffect(() => {
        if (counter>-1) {
            setTimeout(() => setCounter(counter - 1), 1000);
        } else {
            onStart();
        }
    }, [counter]);

    return (
        <div>Game starts in:<br/>{counter} seconds</div>
    );
}

const Game = () => {
    const navigate = useNavigate();
    const { currentUser } = auth;
    const {id} = useParams();
    const [game] = useDocumentData(doc(db, "games", id));
    const [intruder, setIntruder] = useState(false);
    const [waitingForSecondPlayer, setWaitingForSecondPlayer] = useState(false);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [gameStarted, setGameStarted] = useState(false); //to know whether to keep counting down

    useEffect(() => {
        if (game?.status=="waiting") {
            const creator = game?.members.find(m => m.creator === true);

            //new player joins room
            if (creator.uid !== currentUser.uid) {
                const user = {
                    uid: currentUser.uid,
                    name: localStorage.getItem("userName"),
                    creator: false
                }
                const updatedMembers = [...game.members, user];
                updateDoc(doc(db, "games", id), {members: updatedMembers, status: "started"});
                setWaitingForSecondPlayer(false);
                setIsCountingDown(true);
            } else {
                setWaitingForSecondPlayer(true);
            }

        } else if (game?.status=="started") {
            setWaitingForSecondPlayer(false);

            //intruder joins room 
            if (!game.members.map((member) => member.uid).includes(currentUser.uid)) {
                setIntruder(true);
                setTimeout(() => navigate('/'), 6000);
            }

            if (!gameStarted) {
                setIsCountingDown(true);
            }
        } 
    }, [game]);

    const startGame = () => {
        setIsCountingDown(false);
        setGameStarted(true);
    }

    if (intruder) {
        return <div className='game-app'>Game already started, you will be redirected soon</div>
    }

    return (
        <div className='game-app'>
            {game ?
                <>
                    <div className='game'>
                        {waitingForSecondPlayer ? 
                            <>
                                Waiting for the second player...
                                <br/>
                                <br/>
                                <h4>Send the link below to your friend</h4>
                                {id}
                            </>
                        :
                            isCountingDown ? <CountDown onStart={startGame}/>
                            :
                                game.game=="mastermind" ?
                                    <Mastermind/>
                                :
                                    "siema"
                        }
                    </div>
                    <div className='chat-app'>
                        Chat
                        <Chat id={id}/>
                    </div>
                </>
            :
                "Game does not exist, check whether the URL is correct"
            }
        </div>
    )
}

export default Game;