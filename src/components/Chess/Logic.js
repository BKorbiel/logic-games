import React from 'react'

const possibleMoves = (board, piecePosition, castles, enpassant) => {
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
            //castles
            if (board[piecePosition].substr(0, 5)==="white" && !isCheck(board, "white")) {
                if (castles?.whiteLeftCastle) {
                    if (board[59]==="" && board[58]==="" && board[57]==="") {
                        let newBoard = [...board];
                        newBoard[60] = "";
                        newBoard[59] = "white_king";
                        if (!isCheck(newBoard, "white")) {
                            result.push(58);
                        }
                    }
                }
                if (castles?.whiteRightCastle) {
                    if (board[61]==="" && board[62]==="") {
                        let newBoard = [...board];
                        newBoard[60] = "";
                        newBoard[61] = "white_king";
                        if (!isCheck(newBoard, "white")) {
                            result.push(62);
                        }
                    }
                }
            }
            else if (board[piecePosition].substr(0, 5)==="black" && !isCheck(board, "black")) {
                if (castles?.blackLeftCastle) {
                    if (board[3]==="" && board[2]==="" && board[1]==="") {
                        let newBoard = [...board];
                        newBoard[4] = "";
                        newBoard[3] = "black_king";
                        if (!isCheck(newBoard, "black")) {
                            result.push(2);
                        }
                    }
                }
                if (castles?.blackRightCastle) {
                    if (board[5]==="" && board[6]==="") {
                        let newBoard = [...board];
                        newBoard[4] = "";
                        newBoard[5] = "black_king";
                        if (!isCheck(newBoard, "black")) {
                            result.push(6);
                        }
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
                    console.log("xd");
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
        if (board[i]!="" && board[i].substr(0, 5)!=kingColor && board[i].substr(6)!="king") {
            if (possibleMoves(board, i).indexOf(kingPosition)!=-1) {
                return true;
            }
        }
    }
    return false;
}


const isLegalMove = (board, from, to, castles, enpassant) => {
    if (possibleMoves(board, from, castles, enpassant).indexOf(to)===-1) {
        return false;
    }

    let newBoard = [...board];
    newBoard[to] = newBoard[from];
    newBoard[from] = "";
    if (isCheck(newBoard, board[from].substr(0, 5))) {
        return false;
    }
    return true;
}

export default isLegalMove;