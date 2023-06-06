//  alert("it works");
let playing = false;

const fileMenu=["New Game: Easy","New Game: Medium", "NewGame: Hard","Exit"]
const difficultySettings = {
    easy: {
        mines: 10,
        width: 10,
        height: 10,
        spacer: 69
    },
    medium: {
        mines: 40,
        width: 16,
        height: 16,
        spacer: 225
    },
    hard: {
        mines: 99,
        width: 30,
        height: 16,
        spacer: 580
    }
};
let gameblocks=difficultySettings.easy.height*difficultySettings.easy.width; //in the easy game - there are 100 tiles. 
let gamebombs=difficultySettings.easy.mines;
let gameGrid =[];

const game = document.getElementById("mineexe");
createGrid(difficultySettings.easy);
renderGrid(difficultySettings.easy.width,difficultySettings.easy.height);

function handleClick (event){
    const del = document.getElementById("grid");
    if(del)
        del.remove();
    let gd=difficultySettings.easy;
    
    if(event==='medium')
        gd=difficultySettings.medium;
    else if(event==='hard')
        gd=difficultySettings.hard;
    
    createGrid(gd);
    renderGrid(gd.width,gd.height);
    
    document.getElementById("context-menu").remove();
}
function showFileContextMenu(pos, name){

    // if(played>=0 && played<10){ //already played
    //     return;   }

    //hide all menus
    const menus =document.getElementsByClassName("context-menu");
    if(menus)
    for (menu of menus){
        menu.classList.add('gone');
    }

    const newMenu=document.createElement("div");
    newMenu.classList.add("context-menu");
    for(option of fileMenu){
        const opt= document.createElement('a');
        opt.innerHTML=option;
        opt.addEventListener('click', ()=>{handleClick(option)})
        newMenu.appendChild(opt);
    }

}
function play(x,y){
    let played=gameGrid[x][y]; 
    if(played<10&&played>=0) //already played
        return;

    const tileid = tileID(x,y);
    const textID= `txt-${tileid}`

    const tile=document.getElementById(tileid);
    const text=document.getElementById(textID);
    const tiletop= tile.getElementsByClassName('tiletop');



    if(tiletop)
        tiletop[0].classList.add('hide');
    // tile.style.background="Red";

    if (played<0){
        //kaboooom!
        //console.log("KABOOOM!!!!!");
            //detonateBomb* 
            //detonateAllOtherBombs build the algorithm to detonate from wrong step
        tile.style.background="Red";
        text.innerText=":(";
        
        //loose
    }else if(played===10){
        //recursion to open all connected blocks
        //open block, play each block around. 
        //console.log("STRIKE! "+played);
        gameGrid[x][y]-=10;
        //console.log(gameGrid[x][y]);
        tile.style.background="rgb(158,158,158)";
        gameblocks-=1;
        //because it's a 0 play every block around this block starting with x-1 and y-1.
        for(let xo=-1;xo<2;xo++){ //xo x-offset
            for(let yo=-1;yo<2;yo++){ //yo y-offset
                try{
                    if(xo==0&&yo==0){
                        continue;
                    }
                    if (gameGrid[x+xo][y+yo]<0){

                        
                    } else{
                        //console.log(`we are in ${x}-${y}, Playing ${x+xo}-${y+yo}`);                
                        play(x+xo,y+yo);//gameGrid[x][y]+=1;
                    }
                }catch(e){
                    //console.log(e);
                }
               
            }
        }


        //blank show no number. 

    } else{
        // just a regular number, just open the number. 

        
        //console.log("PLAYED THE SENSIBLE "+played);
        gameGrid[x][y]-=10;
        //console.log(gameGrid[x][y]);
        tile.style.background="rgb(182,182,182)";
        if(gameGrid[x][y]!=0)
            text.innerText=gameGrid[x][y];
            text.style.color =`var(--clr-${gameGrid[x][y]})`;
        gameblocks-=1;
        }

    //console.log(`there are currently ${gameblocks} tiles left `);
    if(gameblocks===gamebombs ){
        //console.log(`WINNER WINNER CHICKEN DINNIR!!!`);
    }
    // tile.getElementsByClassName('tiletop').remove();
}

function createGrid(ds) {
    gameblocks=ds.height*ds.width; //in the easy game - there are 100 tiles. 
 gamebombs=ds.mines;
 gameGrid =[];
 const space =document.getElementById("spacer");
    space.setAttribute("style",`width: ${ds.spacer}px;`);
    const bombs=ds.mines;
    const gridWidth=ds.width;
    const gridHeight=ds.height;
    const mines=[];
    gameGrid=[];
    for (let y = 0; y < gridHeight + 2; y++) {
        let row = [];
        for (let x = 0; x < gridWidth + 2; x++) {
            row.push(10);  // if x,y >10 = not visible - when clicked -10 = visible. 
        }
        gameGrid.push(row);
    }
    // printGrid(gameGrid);
    
    //end clear grid. 

    //place bombs.
        for (let i = 0; i < bombs; i++) {
        let y = Math.floor(Math.random() * gridWidth) + 1;
        let x = Math.floor(Math.random() * gridHeight) + 1;
       while (gameGrid[x][y] < 0) {
            y = Math.floor(Math.random() * gridWidth) + 1;
            x = Math.floor(Math.random() * gridHeight) + 1;
        }
        gameGrid[x][y] = -10; //a bomb will still be negative even with 8 adjacents
        
    }
    for (let y = 1; y < gridWidth + 1; y++) {
        for (let x = 1; x < gridHeight + 1; x++) {
            for(let xo=-1;xo<2;xo++){ //xo x-offset
                for(let yo=-1;yo<2;yo++){ //yo y-offset
                    try{
                        if(xo==0&&yo==0){
                            continue;
                        }
                        if (gameGrid[x+xo][y+yo]<0){
                            gameGrid[x][y]+=1;
                        }
                    }catch(e){
                        //console.log(e);
                    }
                   
                }
            }
        }
    }



    // printGrid(gameGrid);

}

function renderGrid(gridWidth,gridHeight){
    //create visual element.
    
    const grid = document.createElement("div");
    grid.classList.add("grid");
    grid.id="grid";
    for (let rowNum = 0; rowNum < gridHeight; rowNum++) {
        const row = document.createElement("div");
        row.classList.add("row");
        row.classList.add(`row${rowNum + 1}`);

        for (let i = 0; i < gridWidth; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile")
            tile.id=tileID(rowNum+1,i+1);
            const tiletop = document.createElement("div");
            tiletop.classList.add("tiletop");
            const text=document.createElement("p");
            text.classList.add("unsellectable");
            text.id=`txt-${tile.id}`;
            tile.appendChild(text);
            tile.addEventListener('click', ()=>{
                //console.log(tile.id);
                play(rowNum+1,i+1);
            });
            tile.appendChild(tiletop);
            row.appendChild(tile);
        }
        grid.appendChild(row);
    }
    game.appendChild(grid);
}

function tileID(row, column){
    row+=1;
    column+=1;
    let id= `${row}-${column}`;
    return id;
}

function printGrid(gridGame) {
    // //console.log (gridGame);
    for (row of gridGame){
        let line ="";
        for (block of row){
            line+=`${block}\t`;
        }
        //console.log(line);
    }
}