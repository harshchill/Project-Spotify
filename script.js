console.log("Code is running");
let currentSong = new Audio();
let songs;

//function to format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    // Pad with leading zeros if needed
    const formattedMins = mins < 10 ? "0" + mins : mins;
    const formattedSecs = secs < 10 ? "0" + secs : secs;
    return `${formattedMins}:${formattedSecs}`;
}

// fetching songs from the local folder
async function getSongs() {
    songs = await fetch("http://127.0.0.1:5500/songs/");
    let response = await songs.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

//Play current song
playMusic = (track,pause = false) => {
    currentSong.src = /songs/ + track
    if (!pause) {
        currentSong.play();
        play.src = "images/pause.png"; // Change play button to pause
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "0:00 / 0:00"; // Reset song time
}

async function main() {
    let songs = await getSongs();

    playMusic(songs[0], true);

    // adding songs to the song list
    let songUL = document
        .getElementById("songList")
        .getElementsByTagName("ul")[0];
    for (const song of songs) {
        let name = song.replaceAll("%20", " ");
        songUL.innerHTML += `<li>
                            <img class="invert w-20" src="images/music-player.png" alt="">
                            <div class="info">
                                <div>${name}</div>
                                <div>Harsh</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="images/play.png" alt="">
                            </div>
                        </li>`;
    }
    

    // attach event listner to all songs
    Array.from(
        document.querySelector(".songList").getElementsByTagName("li")
    ).forEach(e => {
        e.addEventListener("click", () => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        });
    });
   
    // attach event listener to play , next and previous buttons
    play.addEventListener("click", () => {
        if(currentSong.paused) {
            currentSong.play();
            play.src = "images/pause.png";
        }
        else {
            currentSong.pause();
            play.src = "images/play.png";
        }
    });

    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        let currentTime = formatTime(currentSong.currentTime);
        let duration = formatTime(currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${currentTime} / ${duration}`;
        document.querySelector(".circle").style.left = `${(currentSong.currentTime / currentSong.duration) * 100}%`;
    });

    //add event to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let rect = document.querySelector(".seekbar").getBoundingClientRect();
        let x = e.clientX - rect.left;
        let percentage = x / rect.width;
        document.querySelector(".circle").style.left = `${percentage * 100}%`;
        currentSong.currentTime = percentage * currentSong.duration;
    });

    //hamburger menu
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    //close menu
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-140%";
    });

    //add event listener to next button
    next.addEventListener("click", () => {
        let currentIndex = songs.indexOf(currentSong.src.split("/songs/")[1]);
        if (currentIndex < songs.length - 1) {
            playMusic(songs[currentIndex + 1]);
        }
    })

    //add event listener to previous button
    previous.addEventListener("click", () => {
        let currentIndex = songs.indexOf(currentSong.src.split("/songs/")[1]);
        if (currentIndex > 0) {
            playMusic(songs[currentIndex - 1]);
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" ,  (e) => {
        currentSong.volume = parseInt(e.target.value)/100;
        if (e.target.value == 0){
            document.querySelector(".range").getElementsByTagName("img")[0].src = "images/mute.png";
        }
        else {
            document.querySelector(".range").getElementsByTagName("img")[0].src = "images/sound.png";
        }
    }
    )
    
}
main();
