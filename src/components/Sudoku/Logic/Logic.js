import React from 'react';


//https://stackoverflow.com/questions/6924216/how-to-generate-sudoku-boards-with-unique-solutions

export const getConflicts = (position, board, number) => {
    var result = [];
    var positionToCheck;
    for (let i=0; i<9; i++) {

        positionToCheck = (position%9) + 9*i;
        if (number===board[positionToCheck] && positionToCheck!=position) {
            result.push(positionToCheck);
        }

        positionToCheck = Math.floor(position/9)*9 + i;
        if (number===board[positionToCheck] && positionToCheck!=position) {
            result.push(positionToCheck);
        }

        //checking the 3x3 grid in which the given number is located
        var l = (position - position%27) + Math.floor((position%9)/3) *3 
        for (let j=0; j<3; j++) {
            for (let k=0; k<3; k++) {
                positionToCheck = l+j+9*k;
                if ((positionToCheck%9 != position%9) && Math.floor(positionToCheck/9) != Math.floor(position/9)) { //to avoid duplicates in result
                    if (number===board[positionToCheck]) {
                        result.push(positionToCheck);
                    }
                } 
            }
        }
    }

    return result;
}

const solve = (board) => {
    for (let i=0; i<81; i++) {
        if (board[i]===0) {
            for (let j=0; j<100; j++) {
                const number = Math.floor(Math.random() * 9) + 1;
                if (getConflicts(i, board, number).length===0) {
                    board[i]=number;
                    if (solve(board)) {
                        return true;
                    }
                    board[i]=0;
                }
            }
            return false;
        }
    }
    return true;
}

const hasUniqueSolution = (board) => {
    for (let i=0; i<81; i++) {
        if (board[i]===0) {
            let count = 0;
            for (let j=1; j<=9; j++) {
                if(getConflicts(i, board, j).length===0){
                    board[i]=j;
                    if(hasUniqueSolution(board)){
                        if (count>0) {
                            board[i]=0;
                            return false;
                        }
                        count+=1;
                    } else {
                        board[i]=0;
                        return false;
                    }
                    board[i]=0;
                }
            }
            return (count<=1);
        }
    }
    return true;
}

export const setNewBoard = () => {
    let board = Array(81).fill(0);
    solve(board); //create filled board

    let positions = [];
    for (let i = 0; i < 81; i++) {
      positions.push(i);
    }
    positions.sort(() => Math.random() - 0.5);  //shuffle positions to remove from board


    for (let i = 0; i < 81; i++) {  //removing positions and checking if the board still has unique solution
        console.log(i);
        let positionToRemove = positions[i];
        let cellValue = board[positionToRemove];

        board[positionToRemove] = 0;
        if (!hasUniqueSolution(board)) {
            board[positionToRemove] = cellValue;
        } 
    }

    return board;
}
