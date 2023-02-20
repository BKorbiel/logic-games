import React, {useState} from 'react';
import {auth} from '../firebase';
import { signInAnonymously } from 'firebase/auth';
import './Home/Home.css';

const UserForm = () => {
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        localStorage.setItem('userName', name);
        await signInAnonymously(auth);
    }
    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h1>Enter your name</h1>
                <div>
                    <p>
                        <input type="text"
                            name="" id=""
                            className="name-input"
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required />

                    </p>
                </div>
                <br/>
                <div>
                    <p>
                        <button className="start-button" type="submit">
                            Continue
                        </button>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default UserForm;
