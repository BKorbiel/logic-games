import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { doc, updateDoc, Timestamp, setDoc } from "firebase/firestore";
import { auth, db } from '../../firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../App';
import './Game.css';
import Chat from '../Chat/Chat';
import Mastermind from '../Mastermind/Mastermind/Mastermind';
import Sudoku from '../Sudoku/Sudoku/Sudoku';
import Chess from '../Chess/Chess/Chess';
import Minesweeper from '../Minesweeper/Minesweeper/Minesweeper';

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

const GameType = ({type, id}) => {
    switch (type) {
        case "mastermind":
            return <Mastermind id={id}/>
        case "sudoku":
            return <Sudoku id={id}/>
        case "chess":
            return <Chess id={id}/>
        case "minesweeper":
            return <Minesweeper id={id}/>
    }
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

            if (creator.uid !== currentUser.uid) { //new player joins room
                setGame(creator);
            } else {
                setWaitingForSecondPlayer(true);
            }

        } else if (game?.status=="started") {
            setWaitingForSecondPlayer(false);
             
            if (!game.members.map((member) => member.uid).includes(currentUser.uid)) { //intruder joins room
                setIntruder(true);
                setTimeout(() => navigate('/'), 6000);
            }
            if (!gameStarted) {
                setIsCountingDown(true);
            }
        } 
    }, [game]);

    const setGame = (creator) => {
        const user = {
            uid: currentUser.uid,
            name: localStorage.getItem("userName"),
            creator: false
        }
        if (game.game==="chess") {
            let date = new Date();
            date.setSeconds(date.getSeconds() + 12);
            if (creator.color==="white") {
                user.color = "black";
                creator.moveFromTime = Timestamp.fromDate(date);
            } else {
                user.color = "white";
                user.moveFromTime = Timestamp.fromDate(date);
            }
            if (game.timeControl) {
                user.leftTime = game.timeControl*60;
                creator.leftTime = game.timeControl*60;
            }
        }
        if (game.game==="sudoku") {
            setDoc(doc(db, "games", id, "gameStatus", currentUser.uid), {currentBoard: game.startingBoard});
        }
        if (game.game==="minesweeper") {
            setDoc(doc(db, "games", id, "gameStatus", currentUser.uid), {playerBoard: Array(game.rowCount*game.colCount).fill(0), flagsCount: 0});
        }
        
        const updatedMembers = [creator, user];
        const start = Timestamp.fromDate(new Date());
        updateDoc(doc(db, "games", id), {members: updatedMembers, status: "started", started: start});
        game.started=start;

        setWaitingForSecondPlayer(false);
        setIsCountingDown(true);
    }

    const startGame = () => {
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
                                <h4>Send the link below to your friend</h4>
                                <div className='link'>{window.location.href}</div>
                            </>
                        :
                            isCountingDown ? <CountDown onStart={startGame} startDate={game?.started}/>
                            :
                                <GameType type={game.game} id={id}/>
                        }
                    </div>
                    <div className='chat-app'>
                        Chat
                        <Chat id={id}/>
                    </div>
                </>
            :
                <div className='wrong-url'>Game does not exist, check whether the URL is correct</div>
            }
        </div>
    )
}

export default Game;