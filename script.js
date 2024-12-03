let videosWatched = 0;

// Prevent closing the tab before finishing the video
window.addEventListener("beforeunload", (event) => {
    if (!videoFinished) {
        event.preventDefault();
        event.returnValue = "";
    }
});

// Variables
let videoFinished = false;

// Show Dashboard
function showDashboard() {
    document.getElementById("videoForm").classList.add("d-none");
    document.getElementById("videoPlayer").classList.add("d-none");
    document.getElementById("dashboard").classList.remove("d-none");
    document.getElementById("main-content").classList.add("fade-in");
}

// Show Video Form
function showVideoForm() {
    document.getElementById("videoForm").classList.remove("d-none");
    document.getElementById("videoPlayer").classList.add("d-none");
    document.getElementById("dashboard").classList.add("d-none");
    document.getElementById("main-content").classList.add("fade-in");
}

// Start Video
function startVideo() {
    const videoLink = document.getElementById("videoLink").value.trim();
    if (!videoLink) {
        alert("Please enter a valid YouTube link!");
        return;
    }
    const videoId = extractYouTubeID(videoLink);
    if (!videoId) {
        alert("Invalid YouTube link!");
        return;
    }
    document.getElementById("videoPlayer").classList.remove("d-none");
    document.getElementById("videoForm").classList.add("d-none");
    document.getElementById("videoFrame").src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;

    const player = new YT.Player("videoFrame", {
        events: {
            onStateChange: (event) => {
                if (event.data === YT.PlayerState.ENDED) {
                    videoFinished = true;
                    videosWatched++;
                    localStorage.setItem("videosWatched", videosWatched);
                    alert("Great job! You've finished the video.");
                    window.location.reload();
                }
            },
        },
    });

    document.title = "Watching Video...";
}

// Extract YouTube ID from the link
function extractYouTubeID(link) {
    let videoId = null;

    // Handle youtu.be links
    const shortLinkMatch = link.match(/youtu\.be\/([^\s?&]+)/);
    if (shortLinkMatch) {
        videoId = shortLinkMatch[1];
    }

    // Handle youtube.com links (standard videos)
    const fullLinkMatch = link.match(/v=([^\s&]+)/);
    if (fullLinkMatch) {
        videoId = fullLinkMatch[1];
    }

    // Handle youtube.com live links
    const liveLinkMatch = link.match(/\/live\/([^\s?&]+)/);
    if (liveLinkMatch) {
        videoId = liveLinkMatch[1];
    }

    return videoId;
}

// Title Change on New Tab
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && !videoFinished) {
        document.title = "Heeyy! You will be fail on the exam 😥.";
    } else {
        document.title = "BRAIN BOX";
    }
});

// Dashboard
window.onload = () => {
    videosWatched = localStorage.getItem("videosWatched") || 0;
    const studentName = prompt("Please enter your name:");
    if (studentName) {
        document.getElementById("studentName").innerText = studentName;
        document.getElementById("videosWatched").innerText = videosWatched;
        showDashboard();
    }
};

// Logout
function logout() {
    localStorage.removeItem("videosWatched");
    window.location.reload();
}


function updateTime() {
    const timeDisplay = document.getElementById('time-display');
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    timeDisplay.textContent = formattedTime;
}

// Update time every second
setInterval(updateTime, 1000);
updateTime();
