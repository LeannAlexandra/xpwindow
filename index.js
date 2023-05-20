let dev = false; //in development skip artificial delayed timing
let on = false; //doesnt start in an on state/
const waitTime = 100;
// script (startup);
let sysTrayCount = 0;



const removePowerButton = document.getElementById("startupB");
// console.log(removePowerButton);
removePowerButton.addEventListener('click', startup);

// const desktopBackground = new Image("../images/bg.jpg");

if (on) {
    const removeh1 = document.getElementById("startup");
    // const removePowerButton = document.getElementById("startupB");
    removeh1.classList.add("gone");
    removePowerButton.classList.add("gone");
    console.log("pc is on ... awaking from sleep");
    dev = true;
    startup();
}

//input hooks:
window.addEventListener('contextmenu', (event) => {
    // alert("right click intercepted at  " + event.x + " " + event.y);
    console.log(event);

    createContextMenu(event.x, event.y);

    event.preventDefault();
})


async function startup() {
    // console.log("printrandom mumbo jumbo startup stuff.")
    // remo
    // desktop.setAttribute("background-image", desktopBackground);
    const desktop = document.getElementById("desktop");
    document.getElementById("startup").classList.add("gone");
    document.getElementById("startupB").classList.add("gone");
    loadBar();
    preload();
    on = true;
    getUIScale();



}
// runClock();

/*
///TODO:
    1. Start Menu
    1.1: window.ddl & user32.dll

    2. Internet Explorer
        2.1 allow web-access through frame
        2.2 html static search webpage

    3. Desktop Icons, Grid, drag&drop


    xth: ms paint
    xth+1: minesweeper
    xth+2: solitaire





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
    const startupSound = new Audio('sounds/startup.mp3'); // gives the time of loading screen to preload audio
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

        if (startupSound)
            startupSound.play();
        //load and play audio
    }, 1000);
}

function createTaskBar(...args) {
    //args= systray icons-> start with none

    return `<div id="taskbar" class="unselectable taskbar"><div class= "startbutton" >
        <p><em><strong>start</strong></em></p><img class="logo" src="images/logo.svg" alt="" srcset="">
    </div><div class="clockWidget"><p id="clockDisplay" class="clock">20:00</p><div class="systray1 systray"><p>1</p></div><div class="systray2 systray"><p>2</p></div></div ></div > `;
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

