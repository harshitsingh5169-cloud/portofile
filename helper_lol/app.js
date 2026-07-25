/* ============================================================
   HARSHIT_OS — behaviour
   ============================================================ */

const WINDOW_IDS = ['about', 'projects', 'skills', 'resume', 'contact', 'bin'];
const WINDOW_TITLES = {
  about: '👤 About_Me.txt',
  projects: '🗂️ Projects',
  skills: '🛠️ Skills.exe',
  resume: '📄 Resume.pdf',
  contact: '✉️ Contact.txt',
  bin: '🗑️ Recycle Bin'
};

let zTop = 10;
let soundOn = true;
let audioCtx = null;

/* ---------------- SOUND ---------------- */
function beep(freq = 620, dur = 0.06){
  if(!soundOn) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.value = 0.04;
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    osc.stop(audioCtx.currentTime + dur);
  }catch(e){ /* audio unavailable, fail silently */ }
}

function toggleVolume(){
  soundOn = !soundOn;
  document.getElementById('volume-btn').textContent = soundOn ? '🔊' : '🔇';
  if(soundOn) beep(700, 0.08);
}

/* ---------------- THEME ---------------- */
function toggleTheme(){
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'classic' ? 'dark' : 'classic';
  html.setAttribute('data-theme', next);
  try{ localStorage.setItem('harshit_os_theme', next); }catch(e){}
  beep(500, 0.05);
}
(function initTheme(){
  try{
    const saved = localStorage.getItem('harshit_os_theme');
    if(saved) document.documentElement.setAttribute('data-theme', saved);
  }catch(e){}
})();

/* ---------------- CLOCK ---------------- */
function updateClock(){
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if(h === 0) h = 12;
  const str = `${h}:${m} ${ampm}`;
  const clockEl = document.getElementById('clock');
  const phoneClockEl = document.getElementById('phone-clock');
  if(clockEl) clockEl.textContent = str;
  if(phoneClockEl) phoneClockEl.textContent = `${h}:${m}`;
}
setInterval(updateClock, 1000);
updateClock();

/* ---------------- BOOT SCREEN ---------------- */
const bootScreen = document.getElementById('boot-screen');
function dismissBoot(){
  bootScreen.classList.add('hidden');
  setTimeout(() => bootScreen.remove(), 550);
}
setTimeout(dismissBoot, 2400);
bootScreen.addEventListener('click', dismissBoot);

/* ---------------- ICON SELECTION ---------------- */
function selectIcon(el){
  document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
}

/* ---------------- WINDOW MANAGEMENT ---------------- */
function openWindow(id){
  const win = document.getElementById('win-' + id);
  if(!win) return;
  win.classList.add('open');
  focusWindow(id);
  addTaskbarItem(id);
  beep(660, 0.05);
}

function closeWindow(id){
  const win = document.getElementById('win-' + id);
  win.classList.remove('open');
  removeTaskbarItem(id);
  beep(300, 0.05);
}

function minimizeWindow(id){
  const win = document.getElementById('win-' + id);
  win.classList.remove('open');
  beep(420, 0.05);
}

function maximizeWindow(id){
  const win = document.getElementById('win-' + id);
  win.classList.toggle('maximized');
  focusWindow(id);
}

function focusWindow(id){
  document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
  const win = document.getElementById('win-' + id);
  zTop += 1;
  win.style.zIndex = zTop;
  win.classList.add('active');
  document.querySelectorAll('.taskbar-item').forEach(t => t.classList.remove('active'));
  const tb = document.getElementById('task-' + id);
  if(tb) tb.classList.add('active');
}

function addTaskbarItem(id){
  if(document.getElementById('task-' + id)) return;
  const btn = document.createElement('button');
  btn.className = 'taskbar-item';
  btn.id = 'task-' + id;
  btn.textContent = WINDOW_TITLES[id];
  btn.onclick = () => {
    const win = document.getElementById('win-' + id);
    if(win.classList.contains('open') && win.classList.contains('active')){
      minimizeWindow(id);
    }else{
      win.classList.add('open');
      focusWindow(id);
    }
  };
  document.getElementById('taskbar-running').appendChild(btn);
}

function removeTaskbarItem(id){
  const tb = document.getElementById('task-' + id);
  if(tb) tb.remove();
}

/* clicking a window body focuses it */
WINDOW_IDS.forEach(id => {
  const win = document.getElementById('win-' + id);
  if(win) win.addEventListener('mousedown', () => focusWindow(id));
});

/* ---------------- DRAGGABLE WINDOWS ---------------- */
(function enableDragging(){
  document.querySelectorAll('.window').forEach(win => {
    const titlebar = win.querySelector('.titlebar');
    let offsetX = 0, offsetY = 0, dragging = false;

    function startDrag(clientX, clientY){
      if(win.classList.contains('maximized')) return;
      dragging = true;
      const rect = win.getBoundingClientRect();
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
      win.style.transition = 'none';
    }
    function moveDrag(clientX, clientY){
      if(!dragging) return;
      const desktopRect = document.getElementById('desktop').getBoundingClientRect();
      let newLeft = clientX - offsetX - desktopRect.left;
      let newTop = clientY - offsetY - desktopRect.top;
      newLeft = Math.max(0, Math.min(newLeft, desktopRect.width - 80));
      newTop = Math.max(0, Math.min(newTop, desktopRect.height - 40));
      win.style.left = newLeft + 'px';
      win.style.top = newTop + 'px';
    }
    function endDrag(){ dragging = false; }

    titlebar.addEventListener('mousedown', e => {
      startDrag(e.clientX, e.clientY);
      focusWindowById(win);
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup', endDrag);

    titlebar.addEventListener('touchstart', e => {
      const t = e.touches[0];
      startDrag(t.clientX, t.clientY);
      focusWindowById(win);
    }, {passive: true});
    document.addEventListener('touchmove', e => {
      if(!dragging) return;
      const t = e.touches[0];
      moveDrag(t.clientX, t.clientY);
    }, {passive: true});
    document.addEventListener('touchend', endDrag);
  });
})();

function focusWindowById(win){
  const id = win.id.replace('win-', '');
  focusWindow(id);
}

/* ---------------- START MENU ---------------- */
function toggleStartMenu(force){
  const menu = document.getElementById('start-menu');
  const shouldOpen = typeof force === 'boolean' ? force : !menu.classList.contains('open');
  menu.classList.toggle('open', shouldOpen);
  if(shouldOpen) beep(600, 0.04);
}
document.addEventListener('click', e => {
  const menu = document.getElementById('start-menu');
  const startBtn = document.getElementById('start-btn');
  if(!menu.contains(e.target) && e.target !== startBtn && !startBtn.contains(e.target)){
    menu.classList.remove('open');
  }
});

/* ============================================================
   MOBILE — OLD FEATURE PHONE NAVIGATION
   ============================================================ */
const phoneMenu = [
  {
    label: 'About Me',
    body: `Harshit — engineering student at IIIT Vadodara ICD, finishing a bioinformatics internship. CS coursework in DSA plus courses like HS 102 (Science, Technology & Society). Writes and designs games on the side, drawn to psychologically layered, metaphor-driven stories.`
  },
  {
    label: 'Projects',
    body: `PROJECT SPLIT — 2D psychological horror platformer, dual-world mechanic mirrors Leo's dissociation.

PROJECT: HOLLOW — 3-character psychological narrative (Luna, Alter-Ego, Kai).

4CL GENE STUDY — bioinformatics research on Ocimum tenuiflorum under abiotic stress.

SOIL MOISTURE SENSOR — HB100 radar + ESP32, Team Proton.

TRANSIT ROUTE PLANNER — modular C, Dijkstra/Prim/BFS/DFS.`
  },
  {
    label: 'Skills',
    body: `C Programming
Data Structures & Algorithms
Bioinformatics Tools
Circuit Simulation (LTSpice)
Embedded Systems (ESP32)
Game & Narrative Design`
  },
  {
    label: 'Resume',
    body: `Resume available on request. Replace this line with a real download link or contact detail.`
  },
  {
    label: 'Contact',
    body: `Email: your.email@example.com
GitHub: github.com/your-username
LinkedIn: linkedin.com/in/your-profile

(swap these placeholders for your real links)`
  }
];

let phoneIndex = 0;
let phoneView = 'list'; // 'list' | 'detail'

function renderPhone(){
  const content = document.getElementById('phone-content');
  const softLeft = document.getElementById('soft-left');
  const softRight = document.getElementById('soft-right');

  if(phoneView === 'list'){
    let html = '<h3>Main Menu</h3><ul class="phone-menu-list">';
    phoneMenu.forEach((item, i) => {
      html += `<li class="${i === phoneIndex ? 'selected' : ''}">${i + 1}. ${item.label}</li>`;
    });
    html += '</ul>';
    content.innerHTML = html;
    softLeft.textContent = 'Select';
    softRight.textContent = 'Exit';
  } else {
    const item = phoneMenu[phoneIndex];
    content.innerHTML = `<h3>${item.label}</h3><div>${item.body.replace(/\n/g, '<br>')}</div>`;
    softLeft.textContent = 'Options';
    softRight.textContent = 'Back';
  }
}

function phoneNav(action){
  if(phoneView === 'list'){
    if(action === 'up'){ phoneIndex = (phoneIndex - 1 + phoneMenu.length) % phoneMenu.length; }
    else if(action === 'down'){ phoneIndex = (phoneIndex + 1) % phoneMenu.length; }
    else if(action === 'ok'){ phoneView = 'detail'; }
    else if(action === 'back'){ /* already at root */ }
  } else {
    if(action === 'back' || action === 'left'){ phoneView = 'list'; }
  }
  renderPhone();
}

renderPhone();