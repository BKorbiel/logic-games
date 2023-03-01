import React, {useState} from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { doc, setDoc } from "firebase/firestore"; 
import { setNewBoard } from '../Sudoku/Logic/Logic';

const setMastermindGame = (game, difficulty) => {
  game.difficulty = difficulty;
  setDoc(doc(db, "games", game.gameId), game); 
  let colors = [];
  switch (difficulty) {
    case "easy":
      colors = ["blue", "green", "yellow", "red"];
      break;
    case "normal":
      colors = ["blue", "green", "yellow", "red", "pink", "orange"];
      break;
    case "hard":
      colors=["blue", "green", "yellow", "red", "pink", "orange", "brown", "purple"];
  }
  var code = [];
  for (let i=0; i<4; i++) {
    code.push(colors[Math.floor(Math.random() * colors.length)]); 
  }
  game.code = code;
  game.colors = colors;
  setDoc(doc(db, "games", game.gameId), game);
}

const setSudokuGame = (game, difficulty) => {
  game.difficulty = difficulty;

  const board = setNewBoard(difficulty);
  game.startingBoard = board;

  setDoc(doc(db, "games", game.gameId), game); 
  setDoc(doc(db, "games", game.gameId, "gameStatus", game.members[0].uid), {currentBoard: board});
}

const setChessGame = (game, selectedColor, timeControl) => {
  if (selectedColor==="random") {
    game.members[0].color = ["white", "black"][Math.floor(Math.random()*2)];
  } else {
    game.members[0].color = selectedColor;
  }
  if (timeControl!=0) {
    game.timeControl = parseInt(timeControl);
  } else {
    game.timeControl = false;
  }
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
  game.gameOver = false;
  game.drawOffer = false;
  setDoc(doc(db, "games", game.gameId), game); 
}

const Home = () => {
  const { currentUser } = auth;
  const [selectedGame, setSelectedGame] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [chessColor, setChessColor] = useState('');
  const [timeControl, setTimeControl] = useState();
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
    if (selectedGame==="sudoku") {
      setSudokuGame(game, difficulty);
    }
    if (selectedGame==="mastermind") {
      setMastermindGame(game, difficulty);
    }
    if (selectedGame==="chess") {
      setChessGame(game, chessColor, timeControl);
    }

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
              <a target="_blank" href="https://en.wikipedia.org/wiki/Mastermind_(board_game)">Wikipedia</a>
              <br/><br/>
              The first player to guess the code wins
            </>
          }
          {selectedGame==="sudoku" && 
            <>
              <br/>
              <a target="_blank" href="https://en.wikipedia.org/wiki/Sudoku">Wikipedia</a>
              <br/><br/>
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
              <h2>Choose time limit</h2>
              <select id="select" multiple onChange={(e) => setTimeControl(e.target.value)} required>
                <option value={3}>3 minutes</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={0}>No time limit</option>
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