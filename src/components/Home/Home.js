import React, {useState} from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [selectedGame, setSelectedGame] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate(`/${selectedGame}/${difficulty}`);
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
          <h1>Select game</h1>
          <select id="select" multiple onChange={(e) => setSelectedGame(e.target.value)}>
            <option value="mastermind">Mastermind</option>
            <option value="sudoku">Sudoku</option>
          </select>
          {selectedGame && (
            <>
              <h2>Choose a difficulty level</h2>
              <select id="select" multiple onChange={(e) => setDifficulty(e.target.value)}>
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