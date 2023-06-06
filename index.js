let dev = false; //in development skip artificial delayed timing
let on = false; //doesnt start in an on state/
let scripts=[];// if there is a script loaded, it only needs to be loaded once. (better in memory)
let styles=[];//if a style is loaded, it doesn't need to be loaded again.
const waitTime = 100;
// let sysTrayCount = 0;
// newWindow();
const removePowerButton = document.getElementById("startupB");
removePowerButton.addEventListener('click', startup);

if (dev || on) {
    const removeh1 = document.getElementById("startup");
    removeh1.classList.add("gone");
    removePowerButton.classList.add("gone");
    console.log("pc is on ... awaking from sleep");
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
    getUIScale(); // used to set ui scale in rightclick -> display properties * value between 1 and 3 -> but 1.5 is closest to original.* (30px, but translates better to 45px on modern display)

}
function loadCSS(specialRequest){ //the css adding reloads the page/
    
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
function loadJavascript(specialRequest){
    if (scripts.includes(specialRequest))
        return;
    scripts.push(specialRequest);
    var body = document.getElementsByTagName('body');

    console.log(body);
    // if (!body.contains(specialRequest)){
        const newJS=document.createElement("script");
        newJS.setAttribute('src',`apps/${specialRequest}`);
        document.body.appendChild(newJS);
    // }
}

function newWindow(appInfo){
    // alert("it's loading");
    hideStartMenu();
    // loadCSS('window');
    // loadCSS('mine');
    loadJavascript('minesweeper.js');

}
function hideStartMenu(){
    document.getElementById("startmenu").classList.add("gone");
}
function createWindowScript(){

    
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
function setUIScale() { }

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
    setInterval(updateTime, 60000);
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

