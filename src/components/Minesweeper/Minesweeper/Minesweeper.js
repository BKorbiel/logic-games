import React, {useState, useEffect} from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import MinesweeperBoard from '../MinesweeperBoard/MinesweeperBoard';
import CountDown from '../../CountDown';
import { LoadingSpinner } from '../../../App';
import Summary from '../../Summary/Summary';
import './Minesweeper.css';

const Minesweeper = ({id}) => {
    const [game, loading] = useDocumentData(doc(db, "games", id));
    const { currentUser } = auth;
    const [thisPlayerFinished, setThisPlayerFinished] = useState(false);
    const [secondPlayerFinished, setSecondPlayerFinished] = useState(false);

    useEffect(() => {
        for (let i=0; i<2; i++) {
            if (game?.members[i]?.finish) {
                if (game?.members[i].uid==currentUser?.uid) {
                    setThisPlayerFinished(true);
                }
                else {
                    setSecondPlayerFinished(true);
                }
            }
        }
    }, [game]);

    const endTheGame = (didPlayerSolveGrid) => {
        const finish = Timestamp.fromDate(new Date());
        const updatedMembers= game.members;
        for (let i=0; i<2; i++) {
            if (updatedMembers[i].uid == currentUser.uid) {
                updatedMembers[i].finish = finish;
                updatedMembers[i].didSolveGrid = didPlayerSolveGrid;
                updateDoc(doc(db, "games", id), {members: updatedMembers});
                setThisPlayerFinished(true);
            }
        }
    }

    if (loading) {
        <LoadingSpinner/>
      }
    
    return (
        <div className='minesweeper'>
            {thisPlayerFinished ? <Summary game={game} id={id} thisPlayer={game.members.find(m => m.uid === currentUser.uid)} secondPlayer={game.members.find(m => m.uid != currentUser.uid)}/>
            :
            <div className='minesweeper-game'>
                <div className='countdown'><CountDown startDate={game?.started || 0}/></div>
                {game && <MinesweeperBoard game={game} playerId={currentUser.uid} onGameOver={endTheGame} isPlaying={true}/>}
            </div>
            }
        </div>
    )
}

export default Minesweeper;