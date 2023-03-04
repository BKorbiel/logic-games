# Logic Games
- Real-time online multiplayer puzzle game app
- Live demo [_here_](https://logic-games-feae1.web.app/).

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Setup](#setup)

## General Information
> Real-time online multiplayer puzzle game app with chat for players. App made with React and Firebase.
> The application is not mobile responsive. <br/> 
> Live demo [_here_](https://logic-games-feae1.web.app/).

## Technologies Used
- React.js - version 17.0.2
- React Router - version 6.8.2
- Node.js - version 18.12.1
- Firebase - version 9.17.1
- React Firebase Hooks - version 5.1.1
- CSS

## Features
#### Currently available games
- Mastermind - Players are given the same code to guess. The player who guesses the code first wins. There are three difficulty levels available, which determine the total number of colors involved in the game. After finishing their game, the player can observe the opponent's game.
- Sudoku - Players are given the same grid to solve. The player who solves the grid first wins. There are three difficulty levels available, which determine the maximum number of empty cells on a Sudoku grid at the beginning. After finishing their game, the player can observe the opponent's game.
- Chess - Players can choose pawn color and time limit.
- Minesweeper - Players are given the same grid to solve. The player who solves the grid first wins. There are three difficulty levels available, which determine the grid size and the number of bombs. After finishing their game, the player can observe the opponent's game.

#### Real-time chat for players in every game.

## Setup
#### Env Variables
- Set up your Firebase Project in Firebase Console
- Create .env file and add appropriate variables: <br/>
`REACT_APP_FIREBASE = {"apiKey": "YOUR_API_KEY","authDomain": "YOUR_AUTH_DOMAIN","projectId": "YOUR_PROJECT_ID","storageBucket": "YOUR_STORAGE_BUCKET","messagingSenderId": "YOUR_MESSAGING_SENDER_ID","appId": "YOUR_APP_ID"}` <br/>

#### Run application
- Run command line in app directory and write: <br/>
`npm i` <br/>
`npm start`
- Open app in browser with URL (for example: http://localhost:3000/)
