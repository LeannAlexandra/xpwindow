//import {handleClick} from '/apps/minesweeper.js';

let dev = /*true ||/**/ false; //in development skip artificial delayed timing
let on = false; //doesnt start in an on state/
let scripts=[];// if there is a script loaded, it only needs to be loaded once. (better in memory)
let styles=[];//if a style is loaded, it doesn't need to be loaded again.
let uiScale=1; 
const draggingWindow={
    id: '',
    x: 50, //xoffset 
    y: 50, //yoffset
    winw:0, //window width
    winh:0, //window height
    sh:0, //screen height
    sw:0, //screen width
    mousein:false //used for cancelling the "Mouse out timer"
}; //allows an open window to have certain properties. (like size, bounds, and position.)
// let offset=[{x:0,y:0}];
const waitTime = 100;
const body = document.getElementsByTagName('body')[0];
// let sysTrayCount = 0;
// newWindow();
let openWindows=[""]; // open windows = array of windows.
//////////TOPLEVEL DESKTOP LOGIC////////////
body.addEventListener('mouseup',(event)=>{
    draggingWindow.id="";//no window is being dragged
});


/////////////////////////////////////////MINESWEEPER VARIABLES & CONSTS//////////////////////////////////////
const mineGames=[{}]; // an array of objects each object is a game, Ideally only one instance would exist, but we're preparing for the 4 instance scenario.

const fileMenu=["Easy","Medium", "Hard","Exit"]
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

let game;   // = document.getElementById("mineexe"); // PLUS UNIQUE ID* to differentiate between active games. 



////////////////////////////////////////// 











const removePowerButton = document.getElementById("startupB");
removePowerButton.addEventListener('click', startup);



if (dev || on) {
    const removeh1 = document.getElementById("startup");
    removeh1.classList.add("gone");
    removePowerButton.classList.add("gone");
    // console.log("pc is on ... awaking from sleep");
    dev = true;
    startup();
}

window.addEventListener('contextmenu', (event) => {
    if (on) {
        createContextMenu(event.x, event.y);
    }
    event.preventDefault();
})

async function startup() {
    const desktop = document.getElementById("desktop");
    desktop.style.backgroundImage = `url("images/bg.jpg")`;
    document.getElementById("startup").classList.add("gone");
    document.getElementById("startupB").classList.add("gone");
    loadBar();
    preload();
    // on = true;
    uiScale=getUIScale(); // used to set ui scale in rightclick -> display properties * value between 1 and 3 -> but 1.5 is closest to original.* (30px, but translates better to 45px on modern display)
    // console.log(uiScale); // it works to get the uiscale var from the css... 
}
function loadCSS(specialRequest){ //the css adding reloads the page// so dont hotlaod new css...
    
    if (styles.includes(specialRequest))
        return;
    styles.push(specialRequest);
    var headTag = document.getElementsByTagName('head')[0];
    // if (!headTag.contains(specialRequest)){
        const windowcss=document.createElement("link");
        windowcss.href = `styles/${specialRequest}.css`;
        windowcss.type = 'text/css';
        windowcss.rel = 'stylesheet';
        headTag.appendChild(windowcss);
        document.body.appendChild(headTag);
    // }
}
// function loadJavascript(specialRequest){    //////TAKEN OUT BECAUSE MIGRATION OF MINESwEEPeR CODe INTO THIS CODE...
//     if (scripts.includes(specialRequest))
//         return;
//     else{
//             //call function for new easy game.
//             handleClick();
//         }

//     scripts.push(specialRequest);
//     var body = document.getElementsByTagName('body');

//     // console.log(body);
//     // if (!body.contains(specialRequest)){
//         const newJS=document.createElement("script");
//         newJS.setAttribute('src',`apps/${specialRequest}`);
//         document.body.appendChild(newJS);
//     // }
// }

function newWindow(appInfo, timestamp=0, allowMultipleWindows =false){
    //close all colapsable windows.
    hideStartMenu();
    //new window= create new window....

    //add contents = add unique logic.

    if(false){
        newInternetExplorer();
    
    } else if(true || appInfo==="mine"){ //handle minesweeper
        createNewWindow("mineexe");// only creates a window for mine. 
        handleClick();
    }   

}
function newInternetExplorer() //create new window, without winmine, but add textbar, with functions to finally brows internet, set resizable.
{
    alert("it registers as IE8");
    let timestamp=Date.now();
    let windowTitle = "Internet Explorer"
    let windowLogo="ie8.png"
    let toolbars = 3; // 0 -> no toolbars top right of window. (shorthand enum)
    let postLoadScript='minesweeper.js';
    let windowTopBar=true;
    let menuBar=true;
    let menubarItems=["","",""];

    const desktop = document.getElementById("desktop");
    const newWindow = document.createElement('div');
    newWindow.classList.add("window");
    newWindow.id=`${timestamp}`;

    if(menuBar){
        newWindow.innerHTML+=`<div id="menu-bar" class="menu-bar">
        <a class="menu-bar-item" onclick="showFileContextMenu(1, 'game')">Game</a>
        <a class="menu-bar-item disabled" onclick="showFileContextMenu(2, 'help')">Help</a></div>
        <div class="context-menu gone"  id="context-menu" >
                <div class="context-menu-item">
                    <a class="context-menu-item" onclick="handleClick('easy')">File</a><br>
                    <a class="context-menu-item" onclick="handleClick('medium')">Edit</a><br>
                    <a class="context-menu-item" onclick="handleClick('hard')">View</a>
                </div>    
            </div>`;
    }
    newWindow.innerHTML+=`<div class="window-content">
    <div class="${windowContent}" id="${windowContent}"></div></div>`
        desktop.appendChild(newWindow);
        const dragabbleWindowElement=document.getElementById(`draggable${newWindow.id}`);
        dragabbleWindowElement.addEventListener('mousedown',(event)=>{
        draggingWindow.id=timestamp;
        draggingWindow.winw= newWindow.getBoundingClientRect().width;
        draggingWindow.winh= newWindow.getBoundingClientRect().height;
        draggingWindow.sh=document.body.getBoundingClientRect().height;
        draggingWindow.sw=document.body.getBoundingClientRect().width;
        draggingWindow.sh=document.body.getBoundingClientRect().height-draggingWindow.winh-(30*uiScale);
        draggingWindow.sw=document.body.getBoundingClientRect().width-draggingWindow.winw;
        offsetstring=newWindow.getAttribute("style");
        
        if (offsetstring){
            offsetstring=offsetstring.substring(6,offsetstring.length-3);
            draggingWindow.x=parseInt(offsetstring.substring(0,offsetstring.indexOf(`px;`)))-event.clientX;
            draggingWindow.y=parseInt(offsetstring.substring(offsetstring.indexOf(`: `)+1))-event.clientY; 
        }else{
            draggingWindow.x=0-event.clientX;
            draggingWindow.y=0-event.clientY;
        }
    })
    body.addEventListener('mousemove',(event)=>{
        if(draggingWindow.id!=timestamp)
            return; 
        cx =event.clientX+draggingWindow.x;
        if(cx<0)
            cx=0;
        if(cx>draggingWindow.sw)
            cx=draggingWindow.sw;

        cy =event.clientY+draggingWindow.y;
        if(cy<0)
            cy=0;
        if(cy>draggingWindow.sh)
            cy=draggingWindow.sh;
        newWindow.setAttribute("style",`left: ${cx}px; top: ${cy}px;`);
    })
    dragabbleWindowElement.addEventListener('mousein', ()=>{
    });



}
function hideStartMenu(){
    document.getElementById("startmenu").classList.add("gone");
}


function createNewWindow(windowContent){ //this creates minesweeper only -> in refactor, fix the 

    if(document.getElementById(windowContent))
        return; //do nothing -> we can implement another method to create multiple instances. 
    //use the ( window content ** to gather the information regarding titlebar, name, and etc. menubar, )
    //assign values here. 
    let timestamp=Date.now();
    let windowTitle = "Minesweeper"
    let windowLogo="winmine.png"
    let toolbars = 3; // 0 -> no toolbars top right of window. (shorthand enum)
    let postLoadScript='minesweeper.js';
    let windowTopBar=true;
    let menuBar=true;

   
    // creates a window// and addss the input inside the content 
    const desktop = document.getElementById("desktop");
    const newWindow = document.createElement('div');
    newWindow.classList.add("window");
    newWindow.id=`${timestamp}`;

        //  if(windowTopBar){
        //     newWindow.innerHTML+=`<div id="draggable${timestamp}" class="top-bar">
        //     <div class="window-titlebar"><img src="images/${windowLogo}" class="window-logo" alt=""><p class="window-title">${windowTitle}</p></div>
        //     <div class="spacer" id="spacer"></div>
        //     <div class="toolbar-wrapper">
        //     <div class="toolbar minimize ${toolbars>2? "good" : "hide" } "></div>
        //     <div class="toolbar maximize ${toolbars>3? "good" : "hide" }  disabled-toolbar-button"></div>
        //     <div class="toolbar exit  ${toolbars>1? "good" : "hide" }" onclick = "document.getElementById(${timestamp}).remove()"></div></div></div>`;
        // }

    //   onMouseUp={dragEnd} onMouseMove={dragging} onMouseDown={dragStart}
    // console.log(newWindow.getAttribute);
    // //MAKE NEW WINDOW DRAGABLE **
    // newWindow.addEventListener('mouseover', (event)=>{
    //     const sx = event.clientX;
    //     const sy = event.clientY;
    //     console.log(sx + " : " + sy);
    // });
    // newWindow.addEventListener('click', (event)=>{});
    // newWindow.addEventListener('mousemove', (event)=>{});
    

    //add the titlebar and title logo

    if(windowTopBar){
        newWindow.innerHTML+=`<div id="draggable${timestamp}" class="top-bar">
        <div class="window-titlebar"><img src="images/${windowLogo}" class="window-logo" alt=""><p class="window-title">${windowTitle}</p></div>
        <div class="spacer" id="spacer"></div>
        <div class="toolbar-wrapper">
        <div class="toolbar minimize ${toolbars>2? "good" : "hide" } "></div>
        <div class="toolbar maximize ${toolbars>3? "good" : "hide" }  disabled-toolbar-button"></div>
        <div class="toolbar exit  ${toolbars>1? "good" : "hide" }" onclick = "document.getElementById(${timestamp}).remove()"></div></div></div>`;
    }
    

    //add the menuBar
    if(menuBar){
        newWindow.innerHTML+=`<div id="menu-bar" class="menu-bar">
        <a class="menu-bar-item" onclick="showFileContextMenu(1, 'game')">Game</a>
        <a class="menu-bar-item disabled" onclick="showFileContextMenu(2, 'help')">Help</a></div>
        <div class="context-menu gone"  id="context-menu" >
                <div class="context-menu-item">
                    <a class="context-menu-item" onclick="handleClick('easy')">New Game: Easy</a><br>
                    <a class="context-menu-item" onclick="handleClick('medium')">New Game: Medium</a><br>
                    <a class="context-menu-item" onclick="handleClick('hard')">New Game: Hard</a>
                </div>    
            </div>`;
    }

    newWindow.innerHTML+=`<div class="window-content">
    <div class="${windowContent}" id="${windowContent}"></div></div>
    <script src="apps/${postLoadScript}"></script>`

    // const loadScript
    // newWindow.innerHTML+=windowContent;

    desktop.appendChild(newWindow);
    //add the dragabble listeners to the top-bar of the newly created window (that the window can only be dragged by clicking the top bar -> but the function must move the window itsself
    const dragabbleWindowElement=document.getElementById(`draggable${newWindow.id}`);


    //add dragable functionality 
    // #######INITIATE DRAG
    dragabbleWindowElement.addEventListener('mousedown',(event)=>{
        draggingWindow.id=timestamp;

        // draggingWindowElement


        //we dont need all this details, we really just need the offeset (sh,sw)
        // console.log(event);
        draggingWindow.winw= newWindow.getBoundingClientRect().width;
        draggingWindow.winh= newWindow.getBoundingClientRect().height;

        draggingWindow.sh=document.body.getBoundingClientRect().height;
        draggingWindow.sw=document.body.getBoundingClientRect().width;
        // console.log(draggingWindow);
        //we justn eed this
        draggingWindow.sh=document.body.getBoundingClientRect().height-draggingWindow.winh-(30*uiScale);
        draggingWindow.sw=document.body.getBoundingClientRect().width-draggingWindow.winw;
        // console.log(draggingWindow);
        // // document.body
        // console.log();


        offsetstring=newWindow.getAttribute("style");
        
        if (offsetstring){
            offsetstring=offsetstring.substring(6,offsetstring.length-3);
            draggingWindow.x=parseInt(offsetstring.substring(0,offsetstring.indexOf(`px;`)))-event.clientX;
            draggingWindow.y=parseInt(offsetstring.substring(offsetstring.indexOf(`: `)+1))-event.clientY; 
        }else{
            draggingWindow.x=0-event.clientX;
            draggingWindow.y=0-event.clientY;
        }
    })
    // ######## DRAG
    body.addEventListener('mousemove',(event)=>{
        //if it is not being moved ... dont do anything, 
        if(draggingWindow.id!=timestamp)
            return; 


        cx =event.clientX+draggingWindow.x;
        if(cx<0)
            cx=0;
        if(cx>draggingWindow.sw)
            cx=draggingWindow.sw;

        cy =event.clientY+draggingWindow.y;
        if(cy<0)
            cy=0;
        if(cy>draggingWindow.sh)
            cy=draggingWindow.sh;
// console.log(`left: ${cx}px; top: ${cy}px;`);
        newWindow.setAttribute("style",`left: ${cx}px; top: ${cy}px;`);
    })
   // ##########DROP
  
//     dragabbleWindowElement.addEventListener('mouseout', ()=>{
//         // draggingWindow.mousein=false;
//         // setTimeout(()=>{
//             // if(!draggingWindow.mousein)
// //                draggingWindow.id="";/*no window is being dragged*/  //timeout doenst cancel -> reverted to old method;... code let fot future tinkering.
//              // console.log("mouse still out")
//         // },700); // gives the dragging window a bit of time to relocate, if the mouse is not in by the time the timeout calls the function, stop dragging
        
//     });
    dragabbleWindowElement.addEventListener('mousein', ()=>{
        // draggingWindow.mousein=true;
        // console.log("mouse reentered");
    });

    //onStart();
    
    return postLoadScript;
}   
/*
TODO:
    1. start menu
    1.1: window.ddl & user32.dll

    2. Internet Explorer
        2.1 allow web-access through frame
        2.2 html static search webpage

    3. Desktop Icons, Grid, drag&drop

    4. Event menu (rightclick)

    5. Error Msg & error Sound.

    6. "this version of windows is not genuine, (gives a popup hint on hover)"

    xth: ms paint
    xth+1: minesweeper
    xth+2: solitaire

    doom 3d?

*/


function getUIScale() {
    const styles = getComputedStyle(document.documentElement);
    // console.log(parseFloat(styles.getPropertyValue('--ui-scale').trim()))
    return parseFloat(styles.getPropertyValue('--ui-scale').trim());
}
function setUIScale() { 

}

function createContextMenu(x, y) {



}

/////////////////////////////////// FUNCTIONS //////////////////////////////////

async function loadBar() {
    // console.log("loadingbar");
    const initscreen = document.getElementById("init");
    // initscreen.
    document.getElementById("loading-img").classList.remove("gone")
    document.getElementById("progressbar").classList.remove("gone");
    if (dev) {
        initscreen.classList.add("hide");
        return;
    } let loader = document.getElementsByClassName("progblock");
    for (let i = 0; i < loader.length; i++) {
        const time = Math.floor(Math.random() * waitTime);
        // console.log(loader[i]);
        setTimeout(() => {
            loader[i].classList.remove("hide"); //show each bar in its time
            // console.log(loader[i].classList);
            // console.log("  " + loader[i]);
            if (i === loader.length - 1) {
                //the last loop.
                initscreen.classList.add("hide");


                // const taskbar = document.getElementById("taskbar");
                //taskbar.classList.remove("hide");
            }
        }, (waitTime * i + time));

    }
    //add callback on delay to remove the elements from the page.
    gc(initscreen);
}

async function gc(element) {
    if (dev)
        console.log("MARKED FOR DELETION: " + element);

    setTimeout(() => {
        if (dev)
            console.log("GARBAGE: " + element);

        element.remove();
        if (dev)
            console.log("GARBAGE COLLECTED");
    }, waitTime * 100)
}
//dont load during development (when the loadscreen is not hidden, shows the loading animation automatically)

async function preload() {

    desktop.classList.remove("gone");
    desktop.classList.remove("hide");

    let startupSound;
    if (!on && !dev)
        startupSound = new Audio('sounds/startup.mp3'); // gives the time of loading screen to preload audio
    const taskbar = document.createElement("div");
    taskbar.innerHTML = createTaskBar();
    taskbar.classList.add("hide");
    desktop.appendChild(taskbar);
    //below cannot run until taskbar has been created.
    runClock(); //set the clock up before displaying it.
    //const taskbar = document.getElementById("taskbar");
    //
    setTimeout(() => {
        // console.log(`, removing hide.`)
        taskbar.classList.remove("hide");
    }, dev ? 0 : 3000);
    setTimeout(() => {
        //Audio =

        if (!on && startupSound)
            startupSound.play();
        on = true;
        //created start button in createTaskBar() method// (refactor -> more smaller components. )
        document.getElementById("startbutton");
        startbutton.addEventListener('click', toggleStartMenu);
        //load and play audio
    }, 1000);
}
function toggleStartMenu() {
    //show if hidden, hides if shown.
    if(document.getElementById("startmenu"))
        document.getElementById("startmenu").classList.toggle("gone");
    else{
        const standardStartMenu=createStartMenu(); //this never happens*
        const startmenu = document.createElement('div');
        startmenu.innerHTML(standardStartMenu);
        startmenu.id ="startmenu"
        desktop.appendChild(startmenu);
    }
}
function createTaskBar(...args) {
    //args= systray icons-> start with none

    return `<div id="taskbar" class="unselectable taskbar"><div id="startbutton" class="startbutton" >
        <p><em><strong>start</strong></em></p><img class="logo" src="images/logo.svg" alt="" srcset="">
    </div><div class="clockWidget"><p id="clockDisplay" class="clock">20:00</p><div class="systray1 systray"><img class="systray-icon" src="images/defended.png"/>></div><div class="systray2 systray"><img class="systray-icon" src="images/wifi.png"/></div></div ></div > `;
}
function createStartMenu(){
    // const startmenu =document.createElement('div');
    // startmenu.id='startmenu';
    // startmenu.classList.add('startmenu');

    
    //if start menu != exist, make it. 
return `<div id="startmenu" class="startmenu">
<div class="user-details">
    <img class="user-avatar" src="images/user-avatar.svg" alt="">
    <h2 id="username">User</h2>
</div>
<div class="startmenu-content-container">
    <div class="content-left">
        <div class="content-item">
            <img class="content-item-icon" src="images/mycomputer.png" alt="">
            <h3 class="content-item-title">My Computer</h3>
        </div>
        
        <div class="content-item">
            <img class="content-item-icon" src="images/networking.png" alt="">
            <h3 class="content-item-title">Network & Places</h3>
        </div>
        <div class="content-item">
            <img class="content-item-icon" src="images/internet.png" alt="">
            <h3 class="content-item-title">Internet Settings</h3>
        </div>
        
        <div class="content-item">
            <img class="content-item-icon" src="images/recyclebin-empty.png" alt="">
            <h3 class="content-item-title">Recycle bin</h3>
        </div>
        
        <div class="content-item">
            <img class="content-item-icon" src="images/users.png" alt="">
            <h3 class="content-item-title">Users</h3>
        </div>
        <div class="content-item">
            <img class="content-item-icon" src="images/help.png" alt="">
            <h3 class="content-item-title">Help</h3>
        </div>
    </div>
    <div class="content-right">
        <div class="content-item">
            <img class="content-item-icon" src="images/filefolder.png" alt="">
            <h3 class="content-item-title">Assessories</h3>
        </div>
        <div class="content-item">
            <img class="content-item-icon" src="images/filefolder.png" alt="">
            <h3 class="content-item-title">Games
            </h3>
        </div>
        
        <div class="content-item">
            <img class="content-item-icon" src="images/winmine.png" alt="">
            <h3 class="content-item-title">Minesweeper</h3>
        </div>
        <div class="content-item">
            <img class="content-item-icon" src="images/ie8.png" alt="">
            <h3 class="content-item-title">Internet Explorer</h3>
        </div>
        
        <div class="content-item">
            <img class="content-item-icon" src="images/diskdefragment.png" alt="">
            <h3 class="content-item-title">Disk Defragmenter</h3>
        </div>
       
    </div>
</div>
</div>`;

}




/// THE UPDATE CLOCK AND SET INTERVAL TO UPDATE EVERY MINUTE.
async function runClock() {
    updateTime();
    setInterval(updateTime, 6000);
}
function updateTime() {
    const timeDisplay = document.getElementById("clockDisplay");
    const time = new Date();
    h = time.getHours();
    hs = (h > 9 ? h : `0${h} `);//return a string if the integer is not double digits
    m = time.getMinutes();
    ms = (m > 9 ? m : `0${m} `);
    timeDisplay.innerHTML = `${hs}:${ms} `;

}


/*// TODO
/*
//function Icon{} -

icons:
internet explorrer: to show off my web dev.
calculator
sysinfo

a game or two:
pong





/* notes:

show attribution under right - click -> properties.

IE LOGO (ie8.png)
https://www.nicepng.com/maxp/u2q8o0q8a9a9y3o0/

*/
// function to map through icons, render each.
//each icon should have script that makes it drag-droppable on the screen-
//NTH: and on resize keep them in bounds **







/////////////////////////////////////////winmine code

//createGrid(difficultySettings.easy);
//renderGrid(difficultySettings.easy.width,difficultySettings.easy.height);
// export function onStart(){
//     handleClick('easy');
// }
function handleClick (event){
    if(event ===undefined)
    {
        console.log("the click works, but is completely not defined");
        // return;
    }

    //console.log(event);

/*
    ui-scale 1
    small
    287 +2      x     343  +4
    289/347

    med
    445/503

    large
    809,503
  

    uiscale 1.5

    small
    423/511

    med
    654/742

    large
    1193/742


*/
    console.log(event);

    const xdel = document.getElementById("context-menu");
    if(xdel)
        xdel.remove();
    
    game = document.getElementById("mineexe"); // PLUS UNIQUE ID* to differentiate between active games. 
    
    
    const menu =document.getElementsByClassName("context-menu");
    for (m of menu)
        m.remove();

    const del = document.getElementById("grid");  ///+UNIQUE ID>>>>
    if(del)
        del.remove();
    if (event==="Exit")
        return;



    let gd=difficultySettings.easy;
    
    if(event==='Medium')
        gd=difficultySettings.medium;
    else if(event==='Hard')
        gd=difficultySettings.hard;
    

    createGrid(gd);
    renderGrid(gd.width,gd.height);
    
}
function showFileContextMenu(pos, name){

    // if(played>=0 && played<10){ //already played
    //     return;   }
    // console.log("this click is happening: "+`${pos} ... ${name}`)
    //hide all menus
    const menus = document.getElementsByClassName("context-menu");
    
    for (m of menus)
        m.remove();

    const newMenu=document.createElement("div");
    newMenu.classList.add("context-menu");
    for(option of fileMenu){
        const opt= document.createElement('a');
        opt.setAttribute('onClick',`handleClick('${option}')`);
        
        // opt.addEventListener('click', ()=>{ 
        //     console.log(option);
        //      handleClick("CLICKLIE");
        //      })
        opt.classList.add('context-menu-item');
        opt.innerHTML=`${option}`;
        // opt.addEventListener('click', ()=>{ 
        //     console.log(option);
        //      handleClick("CLICKLIE");
        //      })
        newMenu.appendChild(opt);
        newMenu.innerHTML+="<br>";
    }

    document.getElementById("menu-bar").appendChild(newMenu);

    /////TODO: THIS WORKS< BUT...
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
    grid.id="grid"; //+uniqueid///
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
