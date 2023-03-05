import React from 'react'

const possibleMoves = (board, piecePosition, enpassant) => {
    let result = [];
    let i;
    switch (board[piecePosition].substr(6)) {
        case "rook":
            i = piecePosition+1;
            while (Math.floor(i/8)===Math.floor(piecePosition/8)) {
                if (board[i]==="") {
                    result.push(i);
                } else if (board[i].substr(0, 5)!= board[piecePosition].substr(0, 5)) {
                    result.push (i);
                    break;
                } else {
                    break;
                }
                i+=1;
            }

            i=piecePosition-1;
            while (Math.floor(i/8)===Math.floor(piecePosition/8)) {
                if (board[i]==="") {
                    result.push(i);
                } else if (board[i].substr(0, 5)!= board[piecePosition].substr(0, 5)) {
                    result.push (i);
                    break;
                } else {
                    break;
                }
                i-=1;
            }

            i=piecePosition-8;
            while (i>=0) {
                if (board[i]==="") {
                    result.push(i);
                } else if (board[i].substr(0, 5)!= board[piecePosition].substr(0, 5)) {
                    result.push (i);
                    break;
                } else {
                    break;
                }
                i-=8;
            }

            i=piecePosition+8;
            while (i<64) {
                if (board[i]==="") {
                    result.push(i);
                } else if (board[i].substr(0, 5)!= board[piecePosition].substr(0, 5)) {
                    result.push (i);
                    break;
                } else {
                    break;
                }
                i+=8;
            }
            break;
        case "knight":
            for (let j=-1; j<=1; j+=2) {
                for (let k=-1; k<=1; k+=2) {
                    i=piecePosition + 8*j + 2*k;
                    if (
                        i>=0 && 
                        i<64 && 
                        (piecePosition%8>1 || k!=-1) &&
                        (piecePosition%8<6 || k!=1) &&
                        (board[i]==="" || board[i].substr(0, 5)!=board[piecePosition].substr(0, 5))
                        ) {
                        result.push(i);
                    }

                    i=piecePosition + 16*j + k;
                    if (
                        i>=0 && 
                        i<64 && 
                        (piecePosition%8!=0 || k!=-1) &&
                        (piecePosition%8!=7 || k!=1) &&
                        (board[i]==="" || board[i].substr(0, 5)!=board[piecePosition].substr(0, 5))
                        ) {
                        result.push(i);
                    }
                }
            }
            break;
        case "bishop": 
            i=piecePosition-9;
            while (i>=0 && i%8<piecePosition%8) {
                if (board[i]==="") {
                    result.push(i);
                } else if (board[i].substr(0, 5)!= board[piecePosition].substr(0, 5)) {
                    result.push (i);
                    break;
                } else {
                    break;
                }
                i-=9;
            }

            i=piecePosition+9;
            while (i<64 && i%8>piecePosition%8) {
                if (board[i]==="") {
                    result.push(i);
                } else if (board[i].substr(0, 5)!= board[piecePosition].substr(0, 5)) {
                    result.push (i);
                    break;
                } else {
                    break;
                }
                i+=9;
            }

            i=piecePosition-7;
            while (i>=0 && i%8>piecePosition%8) {
                if (board[i]==="") {
                    result.push(i);
                } else if (board[i].substr(0, 5)!= board[piecePosition].substr(0, 5)) {
                    result.push (i);
                    break;
                } else {
                    break;
                }
                i-=7;
            }

            i=piecePosition+7;
            while (i<64 && i%8<piecePosition%8) {
                if (board[i]==="") {
                    result.push(i);
                } else if (board[i].substr(0, 5)!= board[piecePosition].substr(0, 5)) {
                    result.push (i);
                    break;
                } else {
                    break;
                }
                i+=7;
            }
            break;
        case "queen":
            //for bishop + for rook
            let color = board[piecePosition].substr(0, 5);
            let newBoard = [...board];
            newBoard[piecePosition] = `${color}_bishop`;
            result = possibleMoves(newBoard, piecePosition);
            
            newBoard[piecePosition] = `${color}_rook`;
            result = result.concat(possibleMoves(newBoard, piecePosition));
            break;
        case "king":
            for (let j=-1; j<=1; j++) {
                for (let k=-8; k<=8; k+=8) {
                    i=piecePosition+j+k;
                    if (
                        i>=0 && 
                        i<64 && 
                        (piecePosition%8!=0 || j!=-1) &&
                        (piecePosition%8!=7 || j!=1) && 
                        i!=piecePosition && 
                        (board[i]==="" || board[i].substr(0, 5)!= board[piecePosition].substr(0, 5))
                        ) {
                        result.push(i);
                    }
                }
            }
            break;
        case "pawn":
            if (board[piecePosition].substr(0, 5)==="white") {
                if (board[piecePosition-8]==="") {
                    result.push(piecePosition-8);
                    if (Math.floor(piecePosition/8)===6 && board[piecePosition-16]==="") {
                        result.push(piecePosition-16)
                    }
                }
                if (piecePosition%8!=7 && board[piecePosition-7]!="" && board[piecePosition-7].substr(0, 5)==="black") {
                    result.push(piecePosition-7);
                }
                if (piecePosition%8!=0 && board[piecePosition-9]!="" && board[piecePosition-9].substr(0, 5)==="black") {
                    result.push(piecePosition-9);
                }

                //enpassant
                if (piecePosition%8!=7 && piecePosition+1===enpassant) {
                    result.push(piecePosition-7);
                }
                if (piecePosition%8!=0 && piecePosition-1===enpassant) {
                    result.push(piecePosition-9);
                }

            } else {
                if (board[piecePosition+8]==="") {
                    result.push(piecePosition+8);
                    if (Math.floor(piecePosition/8)===1 && board[piecePosition+16]==="") {
                        result.push(piecePosition+16)
                    }
                }
                if (piecePosition%8!=0 && board[piecePosition+7]!="" && board[piecePosition+7].substr(0, 5)==='white') {
                    result.push(piecePosition+7);
                }
                if (piecePosition%8!=7 && board[piecePosition+9]!="" && board[piecePosition+9].substr(0, 5)==="white") {
                    result.push(piecePosition+9);
                }
                //enpassant
                if (piecePosition%8!=7 && piecePosition+1===enpassant) {
                    result.push(piecePosition+9);
                }
                if (piecePosition%8!=0 && piecePosition-1===enpassant) {
                    result.push(piecePosition+7);
                }
            }
            break;
        default:
            break;
    }

    return result;
}

export const isCheck = (board, kingColor) => {
    const kingPosition = board.indexOf(`${kingColor}_king`);
    for (let i=0; i<64; i++) {
        if (board[i]!="" && board[i].substr(0, 5)!=kingColor) {
            if (possibleMoves(board, i).indexOf(kingPosition)!=-1) {
                return true;
            }
        }
    }
    return false;
}

const canDoCastle = (board, to, kingColor, castles) => {
    if (isCheck(board, kingColor)) {
        return false;
    }

    if (kingColor==="white") {
        if (to===62 && castles.whiteLeftCastle) {
            if (board[61]==="" && board[62]==="") {
                let newBoard = [...board];
                newBoard[60] = "";
                newBoard[61] = "white_king";
                if (!isCheck(newBoard, "white")) {
                    newBoard[61] = "white_rook";
                    newBoard[62] = "white_king";
                    return (!isCheck(newBoard, "white"));
                }
            }
        } else if (to===58 && castles.whiteRightCastle) {
            if (board[59]==="" && board[58]==="" && board[57]==="") {
                let newBoard = [...board];
                newBoard[60] = "";
                newBoard[59] = "white_king";
                if (!isCheck(newBoard, "white")) {
                    newBoard[59] = "white_rook";
                    newBoard[58] = "white_king";
                    return (!isCheck(newBoard, "white"));
                }
            }
        } else {
            return false;
        }
    } else {
        if (to===2 && castles.blackLeftCastle) {
            if (board[2]==="" && board[3]==="") {
                let newBoard = [...board];
                newBoard[4] = "";
                newBoard[3] = "black_king";
                if (!isCheck(newBoard, "black")) {
                    newBoard[3] = "black_rook";
                    newBoard[2] = "black_king";
                    return (!isCheck(newBoard, "black"));
                }
            }
        } else if (to===6 && castles.blackRightCastle) {
            if (board[5]==="" && board[6]==="") {
                let newBoard = [...board];
                newBoard[4] = "";
                newBoard[5] = "black_king";
                if (!isCheck(newBoard, "black")) {
                    newBoard[5] = "black_rook";
                    newBoard[6] = "black_king";
                    return (!isCheck(newBoard, "black"));
                }
            }
        } else {
            return false;
        }
    }
    return false;
}

export const isCheckMate = (board, kingColor, enpassant) => {
    if (!isCheck(board, kingColor)) {
        return false;
    }

    for (let i=0; i<64; i++) {
        if (board[i]!="" && board[i].substr(0, 5)===kingColor) {
            let moves = possibleMoves(board, i, enpassant);
            let result = true;
            moves.forEach(move => {
                //dodac enpassant
                let newBoard = [...board];
                newBoard[move] = newBoard[i];
                newBoard[i]="";
                if (!isCheck(newBoard, kingColor)) {
                    result = false;
                    return;
                }
            });
            if (!result) {
                return result;
            }
        }
    }
    return true;
}

const isStalemate = (board, kingColor, enpassant) => {
    for (let i=0; i<64; i++) {
        if (board[i]!=="" && board[i].substr(0, 5)===kingColor) {
            let moves = possibleMoves(board, i, enpassant);
            let result = true;
            moves.forEach(move => {
                if (isLegalMove(board, i, move, null, enpassant)) {
                    result = false;
                    return;
                }
            })
            if (!result) {
                return false;
            }
        }
    }
    return true;
}

export const isDraw = (board, currentMove, enpassant) => {
    if (isCheck(board, currentMove, enpassant)) {
        return false;
    }
    if (isStalemate(board, currentMove, enpassant)) {
        return "Draw by stalemate!";
    }

    let x=0;
    for (let i=0; i<64; i++) {
        if (board[i]!=="" && board[i].substr(6)!=="king" && board[i].substr(6)!=="knight" && board[i].substr(6)!=="bishop") {
            return false;
        } else if (board[i]!=="" && (board[i]==="knight" || board[i]==="bishop")) {
            x+=1;
            if (x>1) {
                return false;
            }
        }
    }
    return "Draw by insufficient material to mate!";
}

export const hasSufficientMaterialToMate = (board, playerColor) => {
    let x=0;
    for (let i=0; i<64; i++) {
        if (board[i]!=="" && board[i].substr(0, 5)===playerColor) {
            if (board[i].substr(6)!=="king" && board[i].substr(6)!=="knight" && board[i].substr(6)!=="bishop") {
                return true;
            } else if (board[i]==="knight" || board[i]==="bishop") {
                x+=1;
                if (x>1) {
                    return true;
                }
            }
        }
    }
    return false;
}

const isLegalMove = (board, from, to, castles, enpassant) => {

    //castles
    if (board[from]==="white_king" && from===60 && (to===62 || to===58)) {
        return canDoCastle(board, to, "white", castles);
    }
    if (board[from]==="black_king" && from===4 && (to===2 || to===6)) {
        return canDoCastle(board, to, "black", castles);
    }


    if (possibleMoves(board, from, enpassant).indexOf(to)===-1) {
        return false;
    }
    
    
    let newBoard = [...board];
    newBoard[to] = newBoard[from];
    newBoard[from] = "";
    
    //enpassant case
    if (board[from].substr(6)==="pawn" && board[to]==="" && to!=from+8 && to!=from+16 && to!=from-8 && to!=from-16) {
        newBoard[enpassant]="";
    }

    if (isCheck(newBoard, board[from].substr(0, 5))) {
        return false;
    }
    return true;
}

export const assignEnpassant = (game, moveFrom, moveTo) => {
    if (game.currentBoard[moveFrom].substr(6)==="pawn" && game.currentBoard[moveTo]==="" && moveTo!=moveFrom+8 && moveTo!=moveFrom+16 && moveTo!=moveFrom-8 && moveTo!=moveFrom-16) {
      game.currentBoard[game.enpassant]="";
    }
    game.enpassant = -1;
    if (game.currentBoard[moveFrom].substr(6)==="pawn" && (moveFrom+16===moveTo || moveFrom-16===moveTo)) {
      game.enpassant=moveTo;
    } 
  }
export const assignCastles = (game, moveFrom, moveTo) => {
    if (moveFrom===4 && moveTo===2 && game.currentBoard[moveFrom]==="black_king") {
        game.currentBoard[3]="black_rook";
        game.currentBoard[0]="";
    }
    if (moveFrom===4 && moveTo===6 && game.currentBoard[moveFrom]==="black_king") {
        game.currentBoard[5]="black_rook";
        game.currentBoard[7]="";
    }
    if (moveFrom===60 && moveTo===58 && game.currentBoard[moveFrom]==="white_king") {
        game.currentBoard[59]="white_rook";
        game.currentBoard[56]="";
    }
    if (moveFrom===60 && moveTo===62 && game.currentBoard[moveFrom]==="white_king") {
        game.currentBoard[61]="white_rook";
        game.currentBoard[63]="";
    }
    if (game.castles.blackLeftCastle && (moveFrom===0 || moveFrom===4 || moveTo===0)) {
        game.castles.blackLeftCastle = false;
    }
    if (game.castles.blackRightCastle && (moveFrom===7 || moveFrom===4 || moveTo===7)) {
        game.castles.blackRightCastle = false;
    }
    if (game.castles.whiteLeftCastle && (moveFrom===56 || moveFrom===60 || moveTo===56)) {
        game.castles.whiteLeftCastle = false;
    }
    if (game.castles.whiteRightCastle && (moveFrom===63 || moveFrom===60 || moveTo===63)) {
        game.castles.whiteRightCastle = false;
    }
}

export default isLegalMove;