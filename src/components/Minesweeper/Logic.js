

export const setGame = (difficulty) => {
    let rowCount;
    let colCount;
    let bombsCount;
    switch (difficulty) {
        case "easy":
            rowCount = 8;
            colCount = 8;
            bombsCount = 10
            break;
        case "normal":
            rowCount = 15;
            colCount = 13;
            bombsCount = 40;
            break;
        case "hard":
            rowCount = 30;
            colCount = 16;
            bombsCount = 99;
            break;
    }

    const gridSize = rowCount * colCount;
    let grid = Array(gridSize).fill(0);
    for (let i=0; i<bombsCount; i++) {
        let bombPosition;
        do {
            bombPosition = Math.floor(Math.random()*gridSize);
        } while(grid[bombPosition]===9);
        grid[bombPosition]=9;
        for (let j=-1; j<=1; j++) {
            for (let k=-1; k<=1; k++) {
                let pos = bombPosition+j+colCount*k;
                if (pos>=0 && 
                    pos<gridSize && 
                    pos!=bombPosition && 
                    (bombPosition%colCount!=0 || j!=-1) && 
                    (bombPosition%colCount!=colCount-1 || j!=1) &&
                    grid[pos]!=9) {
                        grid[pos]+=1;
                }
            }
        }
    }

    return {grid, rowCount, colCount, bombsCount};
}

const DFS = (grid, gridSize, visited, colCount, position) => {
    visited[position]=true;
    let result = [position];
    for (let j=-1; j<=1; j++) {
        for (let k=-1; k<=1; k++) {
            let neighbour = position+j+colCount*k;
            if (neighbour>=0 && 
                neighbour<gridSize && 
                visited[neighbour]===false && 
                (position%colCount!=0 || j!=-1) && 
                (position%colCount!=colCount-1 || j!=1) &&
                grid[neighbour]!=9) {
                    visited[neighbour]=true;
                    if (grid[neighbour]!=0) {
                        result.push(neighbour);
                    } else {
                        result = result.concat(DFS(grid, gridSize, visited, colCount, neighbour));
                    }
            }
        }
    }
    return result;
}

//returns positions to be revealed when the user clicked on an empty cell (by DFS algorithm) 
export const getCellsToReveal = (grid, gridSize, colCount, position) => { 
    let visited = Array(gridSize).fill(false);
    visited[position]=true;
    
    return DFS(grid, gridSize, visited, colCount, position);
}

export const didPlayerWin = (grid, playersBoard) => {
    let result = true;
    grid.forEach((cell, i) => {
        if (cell!=9) {
            if (playersBoard[i]===0 || playersBoard[i]===10) {
                result = false;
                return;
            }
        }
    });
    return result;
}