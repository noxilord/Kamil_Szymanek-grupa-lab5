export {Note, pinnedNotes, otherNotes};

//html note containers:
const pinnedNotes = document.querySelector('#pinned');
const otherNotes = document.querySelector('#others');

class Note {
    constructor(title, content, isPinned, color, tags, notificationDate, id, date) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.isPinned = isPinned;
        this.color = color;
        this.tags = tags;
        this.notificationDate = notificationDate;
        this.date = date;
    }
    display() {
        let noteTemplate = `
        <div class="notes__note" data-id="${this.id}">
            <h2 class="heading-2">${this.title}</h2>
            <p class="notes__note__date">${this.date}</p>
            <p class="notes__note__content">${this.content}</p>`;
        if (this.notificationDate) {
            noteTemplate += `<p class="notes__note__notification">WHEN: ${this.notificationDate}</p>`;
        }
        if (this.tags){
            noteTemplate += `<p class="notes__note__tags">Tags: ${this.tags}</p>`;
        }
        noteTemplate += `</div>`

        if (this.isPinned) {
            pinnedNotes.innerHTML += noteTemplate;
        } else {
            otherNotes.innerHTML += noteTemplate;
        }

        // set note color
        document.querySelector(`[data-id="${this.id}"]`).style.backgroundColor = this.color;
    }
}