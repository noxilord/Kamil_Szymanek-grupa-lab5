import {
    Note,
    pinnedNotes,
    otherNotes
} from './note.js';

//VARIABLES
let notes = [];
let status;
let editedNote;

//DOM ELEMENTS
//Search elements
const searchForm = document.querySelector('.search__form');
const searchInput = document.querySelector('.search__input');
const filteredInfo = document.querySelector('.filtered-info');
const filteredInfoText = document.querySelector('.filtered-info__text');
const filteredInfoRemove = document.querySelector('.filtered-info__remove-btn');

const createNoteBtn = document.querySelector('#create-note-btn');
const newNote = {
    background: document.querySelector('#create-note__background'),
    window: document.querySelector('#create-note__window'),
    title: document.querySelector('#create-note__title'),
    content: document.querySelector('#create-note__content'),
    color: document.querySelector('#create-note__color'),
    pin: document.querySelector('#create-note__pin'),
    notification: document.querySelector('#create-note__notification'),
    tags: document.querySelector('#create-note__tags'),
    confirm: document.querySelector('#create-note__confirm'),
    remove: document.querySelector('#create-note__remove')
};

function changeDisplayOfNotesTitles() {
    if (pinnedNotes.textContent) {
        document.querySelector('.notes--pinned__title').classList.remove('hide');
    } else {
        document.querySelector('.notes--pinned__title').classList.add('hide');
    }
    if (otherNotes.textContent) {
        document.querySelector('.notes--others__title').classList.remove('hide');
    } else {
        document.querySelector('.notes--others__title').classList.add('hide');
    }
}

function changeNewNotePopupColor() {
    //Change popups' background color
    newNote.window.style.backgroundColor = newNote.color.value;
}

function closePopup() {
    newNote.background.classList.add('hide');
}

function displayNotes(notesArr) {
    //Reset previously displayed notes
    pinnedNotes.innerHTML = '';
    otherNotes.innerHTML = '';

    notesArr.forEach(note => {
        note.display();
    });

    //Hide or show pinned/others titles
    changeDisplayOfNotesTitles();
}
function getFormattedDate() {
    return `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0,5)}`;
}
function hideNotePopup(e) {
    if (e.target.classList.contains('create-note__background') || e.target.classList.contains('create-note__cancel')) {
        saveNote();
    }
}

function openNewNotePopup() {
    status = "add";
    //Reset values from inputs
    resetInput();

    //Reset popup window background color
    newNote.window.style.backgroundColor = '#ffffff';

    newNote.background.classList.remove('hide'); //Show popup
    newNote.remove.classList.add('hide'); //Hide remove btn
    newNote.title.focus();
}

function openEditNotePopup(clickedNote) {
    status = "edit";
    newNote.background.classList.remove('hide'); //Show popup
    newNote.remove.classList.remove('hide'); //Show remove btn
    newNote.title.focus();

    //Load inputs
    newNote.title.value = clickedNote.title;
    newNote.content.value = clickedNote.content;
    newNote.pin.checked = clickedNote.isPinned;
    newNote.color.value = clickedNote.color;
    newNote.notification.value = clickedNote.notificationDate;
    newNote.tags.value = clickedNote.tags;

    //Change popup bg color
    newNote.window.style.backgroundColor = clickedNote.color;

    editedNote = clickedNote;
}

function removeNote() {
    const i = notes.indexOf(editedNote);
    const removed = notes.splice(i, 1);
    closePopup();
    displayNotes(notes);

    localStorageRemove(editedNote);
}

function removeSearch() {
    filteredInfo.classList.add('hide');
    displayNotes(notes);
}

function resetInput() {
    newNote.title.value = '';
    newNote.content.value = '';
    newNote.pin.checked = false;
    newNote.color.value = '#ffffff';
}

function saveNote() {
    //Read data from inputs
    let title, content;
    if (newNote.title.value) {
        title = newNote.title.value;
    } else {
        title = "Untitled";
    }
    if (newNote.content.value) {
        content = newNote.content.value;
    } else {
        content = "...";
    }
    const isPinned = newNote.pin.checked;
    const color = newNote.color.value;
    const tags = newNote.tags.value;
    const notificationDate = newNote.notification.value;


    if (status === 'add' && newNote.content.value) { //Create a new note

        const note = new Note(title, content, isPinned, color, tags, notificationDate, Date.now(),
        getFormattedDate());
        notes.push(note);

        //Add note to local storage
        localStorageSet(note);

    } else if (status === 'edit') { //Update the note
        const i = notes.indexOf(editedNote)
        notes[i].title = title;
        notes[i].content = content;
        notes[i].isPinned = isPinned;
        notes[i].color = color;
        notes[i].tags = tags;
        notes[i].notificationDate = notificationDate;

        //Add note to local storage
        localStorageSet(notes[i]);
    }
    removeSearch()
    closePopup();
}

function searchNotes(e) {
    const searchedText = searchInput.value;

    if (e.keyCode === 13) {
        e.preventDefault();

        if (searchedText) { /*There is any text
            Filter the notes */
            const filteredNotes = notes.filter((note) => {
                return (note.title.includes(searchedText) || note.content.includes(searchedText) || note.tags.includes(searchedText));
            });
            //Display filtered info button
            filteredInfo.classList.remove('hide');
            filteredInfoText.textContent = searchedText;

            displayNotes(filteredNotes);

            //Clear search input text
            searchInput.value = '';

        } else { //If the search input was empty ---> display all notes 
            removeSearch();
        }
    }
}

function localStorageGetAll() {
    let noteArr = [];
    Object.keys(localStorage).forEach(key => {
        noteArr.push(JSON.parse(localStorage.getItem(key)));
    });

    noteArr.forEach(n => {
        const note = new Note(n.title, n.content, n.isPinned, n.color, n.tags, n.notificationDate, n.id, n.date);
        notes.push(note);
    });

    displayNotes(notes);
}
localStorageGetAll();
function localStorageSet(note) {
    const key = String(note.id);
    const value = JSON.stringify(note);
    localStorage.setItem(key, value);
}
function localStorageRemove(note) {
    const key = String(note.id);
    localStorage.removeItem(key);
}

//EVENT LISTENERS
searchForm.addEventListener('keydown', searchNotes);
filteredInfoRemove.addEventListener('click', removeSearch);
newNote.color.addEventListener('change', changeNewNotePopupColor) //when color input is changed
createNoteBtn.addEventListener('click', openNewNotePopup);
newNote.background.addEventListener('click', hideNotePopup);
newNote.confirm.addEventListener('click', saveNote);
newNote.remove.addEventListener('click', removeNote);
document.addEventListener('click', (e) => {
    const element = e.target.closest('.notes__note');
    if (element) {
        notes.find(note => {
            if (note.id == element.getAttribute('data-id')) {
                openEditNotePopup(note);
            }
        })
    }
});

changeDisplayOfNotesTitles();