import React, { useState } from 'react';
import {auth, db} from '../../firebase';
import { collection, serverTimestamp, addDoc, orderBy, query } from "firebase/firestore";
import './Chat.css';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const Chat = ({id}) => {
    const messegesRef = collection(db, "games", id, "messeges");
    const q = query(messegesRef, orderBy("createdAt"));
    const [messeges] = useCollectionData(q);
    const [newMessege, setNewMessege] = useState("");
    const { currentUser } = auth;
    const userName = localStorage.getItem('userName');

    
    const sendMessege = async () => {

        setNewMessege("");

        await addDoc(collection(db, "games", id, "messeges"),  {
            creator_name: userName,  
            messege: newMessege,
            createdAt: serverTimestamp(),
        });
    }
 
    return (
        <div className='chat-container'>
            <div className='messeges-container'>
                {messeges && messeges.map((messege, i) => (
                    <div key={i} className="messege"><strong>{messege.creator_name}:</strong>&nbsp;{messege.messege}</div>
                ))}
            </div>
            <div className='new-messege'>
                <input type="text"
                    className="messege-input"
                    placeholder=" Write messege..."
                    value={newMessege}
                    onChange={e => setNewMessege(e.target.value)}/>
                <button className='send-button' onClick={sendMessege}>Send</button>
            </div>
        </div>
    )
}

export default Chat;