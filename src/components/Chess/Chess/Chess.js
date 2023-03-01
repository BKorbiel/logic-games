import { doc, updateDoc, Timestamp} from 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore';
import React, { useState, useEffect } from 'react'
import { db, auth } from '../../../firebase'
import Board from '../Board/Board';
import './Chess.css';
import { useNavigate } from 'react-router-dom';
import { hasSufficientMaterialToMate } from '../Logic';

const endTheGame = (game, result) => {
    const updatedMembers = game.members;
    for (let i=0; i<2; i++) {
        if (updatedMembers[i].color===game.currentMove) {
            updatedMembers[i].leftTime = updatedMembers[i].leftTime-(Timestamp.fromDate(new Date())-updatedMembers[i].moveFromTime);
        }
    }
    console.log(result);
    updateDoc(doc(db, "games", game.gameId), {members: updatedMembers, gameOver: result});
}

const LeftTime = ({user, game}) => {
    const [leftTime, setLeftTime] = useState(user.leftTime);

    useEffect(() => {
        if (!game.gameOver && user.color===game.currentMove) {
            setTimeout(() => setLeftTime(user.leftTime-(Timestamp.fromDate(new Date())-user.moveFromTime)), 1000);
            if (leftTime<=0) {
                setLeftTime(0);
                if (hasSufficientMaterialToMate(game.currentBoard, game.currentMove==="white" ? "black" : "white"))  {
                    endTheGame(game, `${game.members.find(m => m.color!==game.currentMove).name} won by time!`);
                } else {
                    endTheGame(game, `Draw by insufficient material with the opponent having exceeded the time limit!`);
                }
            }
        } else {
            setLeftTime(user.leftTime);
            if (user.leftTime<0) {
                setLeftTime(0);
            }
        }
      }, [leftTime, game.currentMove, game.timeControl]);
    return (
        <div>
            {Math.floor((leftTime/(60))%60)}:{Math.floor(leftTime%60)}
        </div>
    );
}

const Chess = ({id}) => {
    const navigate = useNavigate();
    const [game] = useDocumentData(doc(db, "games", id));
    const  {currentUser} = auth;

    const surrender = () => {
        const winner=game.members.find((m) => m.uid!==currentUser.uid);
        endTheGame(game, `${winner.name} won by opponent's resignation!`);
    }

    const offerDraw = () => {
        updateDoc(doc(db, "games", id), {drawOffer: currentUser.uid});
    }

    const acceptDraw = () => {
        endTheGame(game, "Draw by mutual agreement!");
    }

    const declineDraw = () => {
        updateDoc(doc(db, "games", id), {drawOffer: false});
    }

    return (
        <>
            {game && 
            <div className='chess-game'>
                <div className='player-name'>{game.members.find((m) => m.uid!==currentUser.uid).name}
                {game.timeControl && 
                    <>
                        &nbsp;
                        <LeftTime 
                            user={game.members.find((m) => m.uid!==currentUser.uid)} 
                            game={game}
                        />
                    </>
                }
                </div>
                <Board gameId={id} thisPlayer={game.members.find((m) => m.uid===currentUser.uid)} onGameOver={endTheGame}/>
                <div className='player-name'>{game.members.find((m) => m.uid===currentUser.uid).name}
                {game.timeControl && 
                    <>
                        &nbsp;
                        <LeftTime 
                            user={game.members.find((m) => m.uid===currentUser.uid)} 
                            game={game}
                        />
                    </>
                }
                </div>
                {game.gameOver ? 
                    <div className='result-container'>
                        <div className='result'>{game?.gameOver}</div> 
                        <div className='new-game' onClick={() => navigate('/')}>New game</div>
                    </div>
                : 
                    <div className='options'>
                        {!game.drawOffer ? <div className='offer-draw' onClick={() => offerDraw()}>Offer a draw</div>
                        :
                        game.drawOffer===currentUser.uid ? 
                            <div className='draw-offered'>Waiting for the opponent to accept the draw...</div>
                        : 
                            <div className='draw-offered'>
                                The opponent proposes a draw<br/>
                                <div className='accept' onClick={() => acceptDraw()}>Accept</div>
                                <div className='decline' onClick={() => declineDraw()}>Decline</div>
                            </div>
                        }
                        <div className='end' onClick={() => surrender()}>Surrender</div>
                    </div>
                }
            </div>}
        </>
    )
}

export default Chess;
