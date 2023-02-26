import { doc} from 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore';
import React from 'react'
import { db, auth } from '../../firebase'
import Board from './Board/Board';

const Chess = ({id}) => {
    const [game] = useDocumentData(doc(db, "games", id));
    const  {currentUser} = auth;

    return (
        <>{game && <Board gameId={id} thisPlayer={game.members.find((m) => m.uid===currentUser.uid)}/>}</>
    )
}

export default Chess;
