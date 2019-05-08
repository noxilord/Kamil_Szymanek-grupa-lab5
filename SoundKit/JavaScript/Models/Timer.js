class Timer
{
    constructor()
    {
        this.value = 0;
    }
    //Self-explanatory
    start()
    {
        //Checks if recording, if so adds ms, otherwise resets the timer
        if(isRecording)
        {
            this.value += 100;
        }
        else 
        {
            this.value = 0;
        }
        setTimeout(() => this.start(), 100);
    }
}