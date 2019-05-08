class Track
{
    constructor()
    {
        this.notes = [];
    }
    //Adds ne wnotes
    async addNote(note)
    {
        return new Promise((resolve) => 
        {
            this.notes.push(note);
            resolve();
        });
    }
    //Starts playing track till the end
    async startPlaying(i)
    {
        this.notes[i].playRecordedNote();
        NoteVisual.showNote();
        i++;
        if(i < this.notes.length)
        {
            let delay = this.notes[i].delayToStart
            setTimeout(()=> this.startPlaying(i), delay);
        }
        else
            return;
    }
}