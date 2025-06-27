console.log("Code is running");
let currentSong = new Audio();

// fetching songs from the local folder
async function getSongs() {
    let songs = await fetch("http://127.0.0.1:5500/songs/");
    let response = await songs.text();
    console.log(response);

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
playMusic = (track) => {
    currentSong.src = /songs/ + track
    currentSong.play();
    play.src = "images/pause.png"; // Change play button to pause
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "0:00 / 0:00"; // Reset song time
}

async function main() {
    let songs = await getSongs();
    console.log(songs);

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

}

main();
