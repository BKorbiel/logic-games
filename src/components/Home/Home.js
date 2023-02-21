import React, {useState} from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { doc, setDoc } from "firebase/firestore"; 

const Home = () => {
  const { currentUser } = auth;
  const [selectedGame, setSelectedGame] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const player = {
      uid: currentUser.uid,
      name: localStorage.getItem('userName'),
      creator: true
    };
    const game = {
        game: selectedGame,
        difficulty: difficulty,
        status: 'waiting',
        members: [player],
        gameId: (new Date()).getTime()+Math.random().toString(16).slice(2),
    };
    await setDoc(doc(db, "games", game.gameId), game); 

    navigate(`/game/${game.gameId}`);
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
          <h1>Select game</h1>
          <select id="select" multiple onChange={(e) => setSelectedGame(e.target.value)} required>
            <option value="mastermind">Mastermind</option>
            <option value="sudoku" disabled>Sudoku</option>
          </select>
          {selectedGame && (
            <>
              <h2>Choose a difficulty level</h2>
              <select id="select" multiple onChange={(e) => setDifficulty(e.target.value)} required>
                <option value="easy">Easy</option>
                <option value="normal">Normal</option>
                <option value="hard">Hard</option>
              </select>
            </>
          )}
          <div>
              <p>
                  <button className="start-button" type="submit">
                      Start
                  </button>
              </p>
          </div>
      </form>
    </div>
  )
}

export default Home;