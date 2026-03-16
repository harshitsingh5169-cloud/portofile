const list = document.getElementById('list');

const about = document.getElementById('about');
const skills = document.getElementById('skills');
const project= document.getElementById('project');
const FAQ= document.getElementById('FAQ');
const contact= document.getElementById('contact');
const notes= document.getElementById('notes');
const trash= document.getElementById('trash');
let z=1;
let zIndexCounter = 1;
function openWindow(className, width, height, content){

    // prevent duplicate windows
    if(document.querySelector(`.${className}`)) return;

    const newAPP = document.createElement('div');

    newAPP.classList.add('openAPP', className);

    newAPP.style.width = width + "px";
    newAPP.style.height = height + "px";
    newAPP.style.zIndex = ++zIndexCounter;
    newAPP.innerHTML = `
            <button class="close">X</button>
            ${content}
    `;
    
    list.appendChild(newAPP);
}

about.onclick = () => {
    openWindow(
        "about-window",
        900,
        700,
        `<h3 id="inapp">About Me</h3>
        
        <p>Hello guys</p>
        `
    );
};

skills.onclick = () => {
    openWindow(
        "skills-window",
        500,
        350,
        `<h3 id="inapp">My Skills</h3><p>HTML CSS JavaScript</p>`
    );
};project.onclick = () => {
    openWindow(
        "project-window",
        300,
        200,
        `<h3 id="inapp"project</h3><p>This is my project window</p>`
    );
};
FAQ.onclick = () => {
    openWindow(
        "FAQ-window",
        300,
        200,
        `<h3 id="inapp">FAQ</h3><p>This is my FAQ window</p>`
    );
};
contact.onclick = () => {
    openWindow(
        "contact-window",
        300,
        200,
        `<h3 id="inapp">contact Me</h3><p>This is my contact window</p>`
    );
};
notes.onclick = () => {
    openWindow(
        "notes-window",
        300,
        200,
        `<h3 id="inapp">notes Me</h3><p>This is my notes window</p>`
    );
};
trash.onclick = () => {
    openWindow(
        "trash-window",
        300,
        200,
        `<h3 id="inapp">Trash</h3><p>This is my trash window</p>`
    );
};
document.addEventListener('click', (e)=>{
    if(e.target.classList.contains('close')){
        e.target.closest('.openAPP').remove();
    }
});
const closeAll = document.getElementById('clear_all');

closeAll.onclick = () => {

    const windows = document.querySelectorAll('.openAPP');

    windows.forEach(win => {
        win.remove();
    })};
let cursor = {
    x: null,
    y: null
}

let openAPP = {
    dom: null,
    x: null,
    y: null
}

let desktop = document.getElementById('dekstop');

document.addEventListener('mousedown', (event) => {
    const windowEl = event.target.closest('.openAPP');
    if (windowEl) {

        // bring window to front
        z++;
        windowEl.style.zIndex = z;
    if (event.target.classList.contains('openAPP')) {

        cursor = {
            x: event.clientX,
            y: event.clientY
        }

        openAPP = {
            dom: event.target,
            x: event.target.getBoundingClientRect().left,
            y: event.target.getBoundingClientRect().top
        }

        console.table(cursor);
    }}}
)

document.addEventListener('mousemove', (event)=>{
    if(openAPP.dom == null) return;

    let currentCursor = {
        x: event.clientX,
        y: event.clientY
    }

    let distance = {
        x: currentCursor.x - cursor.x,
        y: currentCursor.y - cursor.y
    }

    let newX = openAPP.x + distance.x;
    let newY = openAPP.y + distance.y;

    let appRect = openAPP.dom.getBoundingClientRect();

    let marginX = 100; // amount allowed outside screen
    let marginY = 50;
    let minX = -appRect.width + marginX;
    let maxX = window.innerWidth - marginX;

    let minY = -appRect.height + marginY;
    let maxY = window.innerHeight - marginY;

    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));

    openAPP.dom.style.left = newX + 'px';
    openAPP.dom.style.top = newY + 'px';
})

document.addEventListener('mouseup', () => {
    if (openAPP.dom == null) return;

    openAPP.dom.style.cursor = 'auto';
    openAPP.dom = null;
});