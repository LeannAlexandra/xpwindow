let draggingElement;
const delta={
    draggin: false,
    x: 0,
    y: 0,
    styles: {
        left: 0,
        top: 0,
        // position: "absolute"
    }}
    const eventListeningWindows=[];

function dragStart(event) {
    //console.log(ev);
    if(eventListeningWindows.includes(event.id.substring(9))) // only add event listeners once. (they will be gone with timestamp window destroyed)
        return;

    eventListeningWindows.push (event.id.substring(9));
    
    draggingElement=document.getElementById( (event.id).substring(9));

    draggingElement.addEventListener('mouseover', (event)=>{
        if (!delta.draggin) {
            return;
        }
        const sx = event.clientX;
        const sy = event.clientY;
        console.log(sx + " : " + sy);
        
        // console.log("APPARENTLY DRAGGIN IS NOT A fUNCTION");
        // //console.log(delta.styles);
        // const cx = event.clientX;
        // const cy = event.clientY;
        // console.log(`${cx} : ${cy}`);
    
        const dx = delta.styles.left + (event.clientX - delta.x);
        const dy = delta.styles.top + (event.clientY - delta.y);
    

    });
    draggingElement.addEventListener('click', (event)=>{
        delta.draggin=true;
        console.log("STaaaart DERAGGIN");
    });
    draggingElement.onmouseup(
        (event)=>{console.log("STOP DERAGGIN");
    }
    )
    draggingElement.addEventListener('mouseup', (event)=>{
        
    });

    console.log(event.id.substring(9));
    console.log(draggingElement)

    //console.log(delta.x);
    const sx = event.clientX;
    const sy = event.clientY;
    // console.log(sx + " : " + sy);
    // setPosition(prevPos => {
    //     return { ...prevPos, x: sx, y: sy, draggin: true }
    // });
}
function dragging(event) {
   
    if (!delta.draggin) {
        return;
    }
    // console.log("APPARENTLY DRAGGIN IS NOT A fUNCTION");
    //console.log(delta.styles);
    const cx = event.clientX;
    const cy = event.clientY;
    // console.log(`${cx} : ${cy}`);

    const dx = delta.styles.left + (event.clientX - delta.x);
    const dy = delta.styles.top + (event.clientY - delta.y);
    setPosition(prevPos => {

        //console.log(prevPos);
        //if (prevPos.draggin)
        //  console.log("still dragging");
        return {
            ...prevPos,
            x: cx,
            y: cy,
            styles: {
                ...prevPos.styles,
                left: dx,
                top: dy
            }
        }
    })

}
function dragEnd(event) {
    // console.log("STOP DRAGGING THIS SHIT");
    if (!delta.draggin) {
        return;
    }
    // console.log(delta.x);
    //let x = event.clientX;
    //console.log(x);
    setPosition(prevPos => {
        return { ...prevPos, draggin: false }
    }); 
    // console.log("end drag... you draggon.");
}
function setPosition(position){
    //do nothing
    // console.log("setposition set to do nothing.");
}