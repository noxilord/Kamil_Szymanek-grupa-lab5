class Note 
{
    constructor(_sound, _delay)
    {
        this.sound = _sound;
        this.delayToStart = _delay;
    }
    //Starts playing note
    async playRecordedNote()
    {
        this.sound.volume = globalVolume;
        this.sound.currentTime = 0;
        this.sound.play();
    }
    //{Static method for playing notes / melody}, checks if any tracks are recording, if so program adds the note to  the array,
    //Starts showing animated note on the main screen and the note icon on selected track, resets timer value
    static async playNote(sound)
    {
        sound.volume = globalVolume;
        sound.currentTime = 0;
        if(isRecording)
        {
            let note = new Note(sound, timer.value);
            for(let i = 0; i < tracks.length; i++)
            {
                if($("#trackSelect"+i).html() == "check")
                {
                    await tracks[i].addNote(note);
                    NoteVisual.showTrackNote(i);
                }
            }
            timer.value = 0;
        }
        sound.play();
        NoteVisual.showNote();
    }
}