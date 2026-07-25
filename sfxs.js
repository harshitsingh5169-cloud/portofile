// ====== STEP 1: DEFINE VARIABLES FIRST ======
let DEFAULT_VOLUME = 0.5; 
let BG_MUSIC_VOLUME = 0.15; // Kept lower so it doesn't drown out hover sounds
let isMuted = false;
const allAudioObjects = [];

// ====== STEP 2: SETUP BACKGROUND MUSIC ======
// Replace 'audios/background.m4a' with your actual background music file path
const bgMusic = new Audio('audios/rain.wav');
bgMusic.loop = true; // Makes the track restart seamlessly when it ends
bgMusic.preload = 'auto';
bgMusic.volume = BG_MUSIC_VOLUME;
allAudioObjects.push(bgMusic); // Register it to the master list so it mutes

// Start background music as soon as the user interacts with the site
const startBgMusic = () => {
  if (!isMuted) {
    bgMusic.play().catch(e => {
      console.log("Waiting for user interaction to start background music.");
    });
  }
  // Remove listeners once it successfully starts playing
  window.removeEventListener('click', startBgMusic);
  window.removeEventListener('mouseenter', startBgMusic);
};

// Listen for the first user action to bypass browser autoplay rules
window.addEventListener('click', startBgMusic);
window.addEventListener('mouseenter', startBgMusic);


// ====== STEP 3: YOUR SOUND EFFECTS LOOPS ======
const tags = document.querySelectorAll('.SFX');
tags.forEach(tag => {
  const audioFilePath = tag.getAttribute('data-sound');
  if (audioFilePath) {
    const audio = new Audio(audioFilePath);
    audio.preload = 'auto';
    audio.volume = DEFAULT_VOLUME;
    allAudioObjects.push(audio);

    tag.addEventListener('mouseenter', () => {
      audio.currentTime = 0; 
      audio.play().catch(e => {});
    });
  }
});

const clickTags = document.querySelectorAll('.SFX1');
clickTags.forEach(tag => {
  const audioFilePath = tag.getAttribute('data-sound');
  if (audioFilePath) {
    const audio = new Audio(audioFilePath);
    audio.preload = 'auto';
    audio.volume = DEFAULT_VOLUME;
    allAudioObjects.push(audio);

    tag.addEventListener('click', () => {
      audio.currentTime = 0; 
      audio.play().catch(e => {});
    });
  }
});


// ====== STEP 4: MUTE BUTTON LOGIC ======
const volButton = document.getElementById('vol_button');
if (volButton) {
  volButton.addEventListener('click', (event) => {
    // Prevent the window click listener from accidentally firing again
    event.stopPropagation(); 

    isMuted = !isMuted; 

    // Handle standard sound effects volume toggle
    allAudioObjects.forEach(audio => {
      if (audio === bgMusic) {
        // Restore background music to its own specific lower volume level
        audio.volume = isMuted ? 0 : BG_MUSIC_VOLUME;
      } else {
        // Restore standard hover/click SFX to default volume level
        audio.volume = isMuted ? 0 : DEFAULT_VOLUME;
      }
    });

    if (isMuted) {
      volButton.classList.add('muted');
    } else {
      volButton.classList.remove('muted');
      // If unmuted, force background music to play if it was paused
      bgMusic.play().catch(e => {});
    }
  });
}
