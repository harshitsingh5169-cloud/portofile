

const songs = {
    Carino: {
        file: "songs/carino.mp3",
        bg: "songs/carino.png"
    },

    Wilbur: {
        file: "songs/internet.mp3",
        bg: "songs/internet.png"
    },

    Bo_bo: {
        file: "songs/twisted.mp3",
        bg: "songs/twisted.png"
    }
};

const audio = document.getElementById("audio");
const songSelect = document.getElementById("song");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

// Gets the player content div
const content = document.querySelector("#player_window .content");

let playing = false;

// Load a song
function loadSong(songName) {

    audio.src = songs[songName].file;

    content.style.backgroundImage = `url("${songs[songName].bg}")`;
    content.style.backgroundSize = "cover";
    content.style.backgroundPosition = "center";
    content.style.backgroundRepeat = "no-repeat";

}

// Load first song on startup
loadSong(songSelect.value);

// Change song from dropdown
songSelect.addEventListener("change", () => {

    loadSong(songSelect.value);

    if (playing) {
        audio.volume = 0.3; 
        audio.play();
    }

});

// Play / Pause
playBtn.addEventListener("click", () => {

    if (audio.paused) {
audio.volume = 0.3; 
        audio.play()
        .then(() => {
            playing = true;
            playBtn.innerHTML = "⏸";
        })
        .catch(err => console.log(err));

    } else {

        audio.pause();
        playing = false;
        playBtn.innerHTML = "▶";

    }

});

// Next
nextBtn.addEventListener("click", () => {

    let i = songSelect.selectedIndex;

    i++;

    if (i >= songSelect.options.length)
        i = 0;

    songSelect.selectedIndex = i;

    loadSong(songSelect.value);
audio.volume = 0.3; 
    audio.play();

    playing = true;

    playBtn.innerHTML = "⏸";

});

// Previous
prevBtn.addEventListener("click", () => {

    let i = songSelect.selectedIndex;

    i--;

    if (i < 0)
        i = songSelect.options.length - 1;

    songSelect.selectedIndex = i;

    loadSong(songSelect.value);
audio.volume = 0.3; 
    audio.play();

    playing = true;

    playBtn.innerHTML = "⏸";

});

// Auto next
audio.addEventListener("ended", () => {

    nextBtn.click();

});