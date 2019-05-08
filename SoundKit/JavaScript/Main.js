// Initialize external Javascript files
let import1 = document.createElement('script');
import1.src = "JavaScript/Models/Track.js";
document.head.appendChild(import1);
let import2 = document.createElement('script');
import2.src = "JavaScript/Models/Note.js";
document.head.appendChild(import2);
let import3 = document.createElement('script');
import3.src = "JavaScript/Models/Timer.js";
document.head.appendChild(import3);
let import4 = document.createElement('script');
import4.src = "JavaScript/View/Listeners.js";
document.head.appendChild(import4);
let import5 = document.createElement('script');
import5.src = "JavaScript/View/NoteVisuals.js";
document.head.appendChild(import5);

// Global volume 0 / 1
let globalVolume = 0.1;
// Variables for tabs (if opened)
let settingsOpened = false;
let tracksOpened = true;
let isRecording = false;
// List of tracks
let tracks = [];
// List of available sounds
let sounds = 
[
    new Audio("./sounds/boom.wav"),
    new Audio("./sounds/clap.wav"),
    new Audio("./sounds/hihat.wav"),
    new Audio("./sounds/kick.wav"),
    new Audio("./sounds/openhat.wav"),
    new Audio("./sounds/ride.wav"),
    new Audio("./sounds/snare.wav"),
    new Audio("./sounds/tink.wav"),
    new Audio("./sounds/tom.wav")
];
// Types of available notes
let noteTypes = 
[
    "&#9833;","&#9834;","&#9835;",
    "&#9836;","&#9837;"
];