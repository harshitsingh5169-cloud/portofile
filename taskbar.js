let highestZ = 5;
console.log("Clock JS Loaded");

document.addEventListener("DOMContentLoaded", () => {
    function updateClock() {
        const now = new Date();
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        
        const element = document.getElementById('currtime');
        if (element) {
            element.textContent = `${hours}:${minutes}`;
        }
    }

    // Safely fire immediately and establish the intervals
    updateClock();
    setInterval(updateClock, 30000);
});
const taskboxes = [
    document.getElementById("box1"),
    document.getElementById("box2"),
    document.getElementById("box3"),
    document.getElementById("box4")
];

taskboxes.forEach(box=>{
    box.style.display="none";
});

document.querySelectorAll(".apps").forEach(app=>{

    app.onclick=()=>{

        const win=document.getElementById(app.dataset.window);
        if ( win.id === "reload") {
        window.location.reload(); 
        return; // Stops further execution since the page is refreshing
    }
        win.style.display="block";
        win.style.zIndex=++highestZ;

        createTaskbar(win);

    };

});

function createTaskbar(win){

    if(win.taskBox) return;

    const empty=taskboxes.find(b=>b.dataset.used!="true");

    if(!empty) return;

    empty.dataset.used="true";
    empty.style.display="flex";
    empty.style.alignItems="center";
    empty.style.justifyContent="center";

    empty.textContent=win.querySelector(".title-bar span").textContent;

    empty.onclick=()=>{

        if(win.style.display=="none"){

            win.style.display="block";
            win.style.zIndex=++highestZ;

        }else{

            win.style.display="none";

        }

    };

    win.taskBox=empty;

}

document.querySelectorAll(".windows").forEach(win=>{

    win.addEventListener("mousedown",()=>{

        win.style.zIndex=++highestZ;

    });

    const bar=win.querySelector(".title-bar");

    let dragging=false;
    let x=0;
    let y=0;

    bar.addEventListener("mousedown",(e)=>{

        dragging=true;

        x=e.clientX-win.offsetLeft;
        y=e.clientY-win.offsetTop;

    });

    document.addEventListener("mousemove", (e) => {

    if (!dragging) return;

    const visibleTitle = bar.offsetHeight;

    let newLeft = e.clientX - x;
    let newTop = e.clientY - y;

    // Allow most of the window off-screen horizontally,
    // but keep at least 120px visible.
    newLeft = Math.max(
        -(win.offsetWidth - 120),
        Math.min(newLeft, window.innerWidth - 120)
    );

    // Keep the title bar visible vertically.
    newTop = Math.max(
        0,
        Math.min(newTop, window.innerHeight - visibleTitle)
    );

    win.style.left = `${newLeft}px`;
    win.style.top = `${newTop}px`;

});

    document.addEventListener("mouseup",()=>{

        dragging=false;

    });

    win.querySelector(".close").onclick=(e)=>{

        e.stopPropagation();

        win.style.display="none";

        if(win.taskBox){

            win.taskBox.dataset.used="false";
            win.taskBox.style.display="none";
            win.taskBox.textContent="";

            win.taskBox=null;

        }

    };

    win.querySelector(".minimize").onclick=(e)=>{

        e.stopPropagation();

        win.style.display="none";

    };

});


