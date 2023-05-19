const dev = true; //in development skip artificial delayed timing
// script (startup);
let sysTrayCount = 0;
preload();




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





/////////////////////////////////// FUNCTIONS //////////////////////////////////


async function preload() {
    const desktop = document.getElementById("desktop");
    desktop.classList.remove("hide");


    const taskbar = document.createElement("div");

    taskbar.innerHTML = taskBar("1");
    taskbar.classList.add("hide");
    desktop.appendChild(taskbar);
    //below cannot run until taskbar has been created.
    runClock(); //set the clock up before displaying it.
    //const taskbar = document.getElementById("taskbar");
    //
    setTimeout(() => {
        // console.log(`, removing hide.`)
        taskbar.classList.remove("hide");
    }, dev ? 0 : 2000);
}

function taskBar(...args) {
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

