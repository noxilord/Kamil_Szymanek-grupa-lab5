var timer;

window.addEventListener('load', () => 
{
    //Creates 4 tracks
    for(let i = 0; i < 4; i++)
    {
        tracks.push(new Track());
    }
    //Initializes timer class and start timer
    timer = new Timer();
    timer.start();

    //Adds key listener
    window.addEventListener('keyup', keyHandler)
    //Opens and closes settings tab
    $("#settingsIcon").click(() => 
    {
        if(settingsOpened)
        {
            $("#settingsBox").css("left", -100);
            settingsOpened = false;
        }
        else 
        {
            $("#settingsBox").css("left", 0);
            settingsOpened = true;
        }
    });
    //Changes volume (dop. input)
    $("#settingsVolume").on("input change", () =>
    {
        globalVolume = $("#settingsVolume").val();
    });
    //Shows types of sound available
    $("#infoBox").click
    (
        () => alert("1 - boom\n2 - clap\n3 - hihat\n4 - kick\n5 - openhat\n6 - ride\n7 - snare\n8 - tink\n9 - tom")
    );
    //opens and closes tracks tab
    $("#tracksOpen").click(() => 
    {
        if(tracksOpened)
        {
            $("#tracksBox").css("bottom", -300);
            $("#tracksOpenIcon").html("keyboard_arrow_up");
            tracksOpened = false;
        }
        else 
        {
            $("#tracksBox").css("bottom", 0);
            $("#tracksOpenIcon").html("keyboard_arrow_down");
            tracksOpened = true;
        }
    });
    //Starts playing selected recorded tracks
    $("#playButton").click(() => 
    {
        for(let i = 0; i < tracks.length; i++)
        {
            if($("#trackSelect"+i).html() == "check")
            {
                setTimeout(() => tracks[i].startPlaying(0), tracks[0].notes[0].delayToStart);
            }
        }
        
    });
    //Changes color on hover 
    $("#playButton").mouseover((event) =>
    {
        event.target.style.color = "#e22d2d";
    });
    $("#playButton").mouseout((event) =>
    {
        event.target.style.color = "#efefef";
    });
    //Records on selected tracks
    $("#recordButton").click(() =>
    {
        if(isRecording)
        {
            $("#recordButton").css("color", "#efefef");
            isRecording = false;
        }
        else 
        {
            $("#recordButton").css("color", "#e22d2d");
            isRecording = true;
            timer.value = 0;
        }
    });
    //Clears selected tracks
    $("#clearButton").click(() => 
    {
        for(let i = 0; i < tracks.length; i++)
        {
            if($("#trackSelect"+i).html() == "check")
            {
                tracks[i].notes = [];
                $("#tracks"+i+"Content").html("");
            }
        }
        
    });
    //Changes color on hover
    $("#clearButton").mouseover((event) =>
    {
        event.target.style.color = "#e22d2d";
    });
    $("#clearButton").mouseout((event) =>
    {
        event.target.style.color = "#efefef";
    });
    //Sets track to active
    $(".trackSelect").click((event) => 
    {
        let clicked = $("#"+event.target.id);
        if(clicked.html() == "check")
        {
            clicked.html("");
        }
        else 
        {
            clicked.html("check");
        }
    });

})
//Recognizes which key was pressed and plays matching sound
function keyHandler(event)
{
    event = event || window.event;
    let key = event.key || String.fromCharCode(event.which);
    switch(key)
    {
        case '1':
            Note.playNote(sounds[0]);
            break;
        case '2':
            Note.playNote(sounds[1]);
            break;
        case '3':
            Note.playNote(sounds[2]);
            break;
        case '4':
            Note.playNote(sounds[3]);
            break;
        case '5':
            Note.playNote(sounds[4]);
            break;
        case '6':
            Note.playNote(sounds[5]);
            break;
        case '7':
            Note.playNote(sounds[6]);
            break;
        case '8':
            Note.playNote(sounds[7]);
            break;
        case '9':
            Note.playNote(sounds[8]);
            break;

    }
}