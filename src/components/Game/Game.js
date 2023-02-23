import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Chat from '../Chat/Chat';
import './Game.css';
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { auth, db } from '../../firebase';
import Mastermind from '../Mastermind/Mastermind';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../App';

const CountDown = ({onStart, startDate}) => {
    const [counter, setCounter] = useState(Math.floor(11-(Timestamp.fromDate(new Date()) - startDate)));
    useEffect(() => {
        if (counter>-1) {
            setTimeout(() => setCounter(Math.floor(11-(Timestamp.fromDate(new Date()) - startDate))), 1000);
        } else {
            onStart();
        }
    }, [counter, startDate]);

    return (
        <div>Game starts in:<br/>{counter} seconds</div>
    );
}

const Game = () => {
    const navigate = useNavigate();
    const { currentUser } = auth;
    const {id} = useParams();
    const [game, loading] = useDocumentData(doc(db, "games", id));
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
                const start = Timestamp.fromDate(new Date());
                updateDoc(doc(db, "games", id), {members: updatedMembers, status: "started", started: start});
                game.started=start;

                setWaitingForSecondPlayer(false);
                setIsCountingDown(true);
                console.log(1);
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
                console.log(2);
            }
        } 
    }, [game]);

    const startGame = () => {
        console.log(3);
        setIsCountingDown(false);
        setGameStarted(true);
    }

    if (intruder) {
        return <div className='game-app'>Game already started, you will be redirected soon</div>
    }

    if (loading) {
        <LoadingSpinner/>
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
                                {window.location.href}
                            </>
                        :
                            isCountingDown ? <CountDown onStart={startGame} startDate={game?.started}/>
                            :
                                game.game=="mastermind" ?
                                    <Mastermind id={id}/>
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