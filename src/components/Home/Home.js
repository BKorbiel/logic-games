import React, {useState} from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { doc, setDoc } from "firebase/firestore"; 

const Home = () => {
  const { currentUser } = auth;
  const [selectedGame, setSelectedGame] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [chessColor, setChessColor] = useState('');
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
        status: 'waiting',
        members: [player],
        gameId: (new Date()).getTime()+Math.random().toString(16).slice(2),
    };
    if (selectedGame==="mastermind" || selectedGame==="sudoku") {
      game.difficulty = difficulty;
    }
    if (selectedGame==="chess") {
      if (chessColor==="random") {
        setChessColor(["white", "black"][Math.floor(Math.random()*2)]);
      }
      game.members[0].color = chessColor;
      game.currentBoard = [
        'black_rook', 'black_knight', 'black_bishop', 'black_queen', 'black_king', 'black_bishop', 'black_knight', 'black_rook',
        'black_pawn', 'black_pawn', 'black_pawn', 'black_pawn', 'black_pawn', 'black_pawn', 'black_pawn', 'black_pawn',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        'white_pawn', 'white_pawn', 'white_pawn', 'white_pawn', 'white_pawn', 'white_pawn', 'white_pawn', 'white_pawn',
        'white_rook', 'white_knight', 'white_bishop', 'white_queen', 'white_king', 'white_bishop', 'white_knight', 'white_rook'
      ];
      game.currentMove = "white";
      game.castles = {
        blackLeftCastle: true,
        blackRightCastle: true,
        whiteLeftCastle: true,
        whiteRightCastle: true,
      }
      game.enpassant = -1;
    }

    await setDoc(doc(db, "games", game.gameId), game); 

    navigate(`/game/${game.gameId}`);
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
          <h1>Select game</h1>
          <select id="select" multiple onChange={(e) => setSelectedGame(e.target.value)} required>
            <option value="mastermind">Mastermind</option>
            <option value="sudoku">Sudoku</option>
            <option value="chess">Chess</option>
          </select>
          {selectedGame==="mastermind" && 
            <>
              <br/>
              <a href="https://en.wikipedia.org/wiki/Mastermind_(board_game)">Wikipedia</a>
              <br/>
              The first player to guess the code wins
            </>
          }
          {selectedGame==="sudoku" && 
            <>
              <br/>
              <a href="https://en.wikipedia.org/wiki/Sudoku">Wikipedia</a>
              <br/>
              The first player to solve the sudoku wins
            </>
          }
          {selectedGame==="chess" && 
            <>
              <h2>Choose your color</h2>
              <select id="select" multiple onChange={(e) => setChessColor(e.target.value)} required>
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="random">Random</option>
              </select>
            </>
          }
          {(selectedGame==="sudoku"||selectedGame==="mastermind") && (
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