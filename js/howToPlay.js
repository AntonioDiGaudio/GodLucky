const videos = [
    {
        title: "La natura in movimento",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Paesaggi mozzafiato",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumbnail: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Avventure in montagna",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Vita sottomarina",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        thumbnail: "https://images.unsplash.com/photo-1439405326854-014607f694d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
];

const videoPlayer = document.getElementById('videoPlayer');
const videoTitle = document.getElementById('videoTitle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentEl = document.getElementById('current');
const totalEl = document.getElementById('total');
const thumbnailsContainer = document.getElementById('thumbnailsContainer');

let currentVideoIndex = 0;

function loadVideo(index) {
    if (index < 0 || index >= videos.length) return;

    currentVideoIndex = index;
    const video = videos[index];

    videoPlayer.src = video.src;
    videoTitle.textContent = video.title;
    currentEl.textContent = index + 1;

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === videos.length - 1;

    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });

    videoPlayer.load();
}

function createThumbnails() {
    thumbnailsContainer.innerHTML = '';
    videos.forEach((video, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail';
        thumb.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}">
            <div class="number">${index + 1}</div>
        `;
        thumb.addEventListener('click', () => loadVideo(index));
        thumbnailsContainer.appendChild(thumb);
    });
}

function init() {
    totalEl.textContent = videos.length;
    createThumbnails();
    loadVideo(0);

    prevBtn.addEventListener('click', () => {
        if (currentVideoIndex > 0) loadVideo(currentVideoIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        if (currentVideoIndex < videos.length - 1) loadVideo(currentVideoIndex + 1);
    });
}

window.addEventListener('DOMContentLoaded', init);
