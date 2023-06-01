// alert("it works");
let playing = false;

const difficultySettings = {
    easy: {
        mines: 10,
        width: 10,
        height: 10
    },
    medium: {
        mines: 40,
        width: 16,
        height: 16
    },
    hard: {
        mines: 99,
        width: 30,
        height: 16
    }
};

const game = document.getElementById("mineexe");
createGrid(difficultySettings.easy);

// if (!playing)
//     newGame(difficultySettings.easy);













function newGame(size) {
    playing = true;
    const grid = [];
    for (let y = 0; y < size + 2; y++) {
        let row = [];
        console.log("creating new row");
        for (let x = 0; x < size + 2; x++) {
            console.log(`${x} ${y}`);
            row.push(0);
        }
        console.log("Row: " + row);
        grid.push(row);
        printGrid(grid, size);
    }

    const bombs = [];
    console.log("creating bombs");
    for (let i = 0; i < size; i++) {
        let x = Math.floor(Math.random() * size) + 1;
        let y = Math.floor(Math.random() * size) + 1;
        while (grid[x][y] < 0) {
            x = Math.floor(Math.random() * size) + 1;
            y = Math.floor(Math.random() * size) + 1;
        }
        console.log(`bomb ${i} at ${x} ${y}`);
        grid[x][y] = -10; //a bomb will still be negative even with 8 adjacents
    }
    printGrid(grid, size);

    for (let y = 1; y <= size; y++) {
        for (let x = 1; x <= size; x++) {
            if (grid[x][y] >= 0) {
                // scan the 8 blocks around.
                for (let a = -1; a <= 1; a++) {
                    for (let b = -1; b <= 1; b++) {
                        if (a == 0 && b == 0)
                            continue; //skip the current block
                        if (grid[x + a][y + b] < 0) {
                            grid[x][y]++;
                        }
                    }
                }
            }
        }
    }
    console.log(grid);
    printGrid(grid, size);
}



function createGrid(ds) {
    const bombs=ds.mines;
    const gridWidth=ds.width;
    const gridHeight=ds.height;
    const grid = document.createElement("div");
    grid.classList.add("grid");
    // grid.setAttribute("height", "400px");
    for (let rowNum = 0; rowNum < gridHeight; rowNum++) {
        const row = document.createElement("div");
        row.classList.add("row");
        row.classList.add(`row${rowNum + 1}`);

        for (let i = 0; i < gridWidth; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile")
            const tiletop = document.createElement("div");
            tiletop.classList.add("tiletop")
            // const text = document.createElement('p');
            // text.innerHTML = `${rowNum + 1} ${i + 1}`;
            // block.appendChild(text);
            tile.appendChild(tiletop);
            row.appendChild(tile);
        }
        grid.appendChild(row);
    }
    game.appendChild(grid);
}


function printGrid(grid, size = difficultySettings.easy) {
    for (let y = 0; y < size + 1; y++) {
        // const row
        let row = grid[y];
        let line = "";
        if (row)
            row.forEach(element => {
                const bloc = document.createElement(div);

                line += element + "\t";
            });
        console.log(line);
    }
}