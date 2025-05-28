const videos = [
    {
        title: "Trama",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Informazioni generali",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumbnail: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Componenti",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Divinità",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        thumbnail: "https://images.unsplash.com/photo-1439405326854-014607f694d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Plancia",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        thumbnail: "https://images.unsplash.com/photo-1439405326854-014607f694d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Fasi di gioco",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        thumbnail: "https://images.unsplash.com/photo-1439405326854-014607f694d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Movimento",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        thumbnail: "https://images.unsplash.com/photo-1439405326854-014607f694d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Paradiso e inferno",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        thumbnail: "https://images.unsplash.com/photo-1439405326854-014607f694d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Carte miracolo",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        thumbnail: "https://images.unsplash.com/photo-1439405326854-014607f694d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Carte oggetto",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        thumbnail: "https://images.unsplash.com/photo-1439405326854-014607f694d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Il folle",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        thumbnail: "https://images.unsplash.com/photo-1439405326854-014607f694d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Battaglia",
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        thumbnail: "https://images.unsplash.com/photo-1439405326854-014607f694d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }, 
    {
        title: "Regole generali",
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

    const video = videos[index];

    // Rimuovi animazioni precedenti
    videoPlayer.classList.remove('fade-in');
    videoPlayer.classList.add('fade');

    // Attendi che l'opacità scenda a 0, poi cambia video
    setTimeout(() => {
        currentVideoIndex = index;

        videoPlayer.src = video.src;
        videoTitle.textContent = video.title;
        currentEl.textContent = index + 1;

        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === videos.length - 1;

        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        videoPlayer.load();

        // Riapplica la classe fade-in
        videoPlayer.classList.remove('fade');
        videoPlayer.classList.add('fade-in');

    }, 200); // tempo di fade-out
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
    enableCarouselDragging(thumbnailsContainer);

    loadVideo(0);

    prevBtn.addEventListener('click', () => {
        if (currentVideoIndex > 0) loadVideo(currentVideoIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        if (currentVideoIndex < videos.length - 1) loadVideo(currentVideoIndex + 1);
    });
}

window.addEventListener('DOMContentLoaded', init);




function enableCarouselDragging(container) {
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;

    container.addEventListener('pointerdown', (e) => {
        isDragging = true;
        container.classList.add('dragging');
        startX = e.clientX;
        scrollStart = container.scrollLeft;

        container.setPointerCapture(e.pointerId);
    });

    container.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const scrollSpeed = 7; 
        container.scrollLeft = scrollStart - dx * scrollSpeed;
    });

    container.addEventListener('pointerup', () => {
        isDragging = false;
        container.classList.remove('dragging');
    });

    container.addEventListener('pointercancel', () => {
        isDragging = false;
        container.classList.remove('dragging');
    });
}
thumbnailsContainer.addEventListener('wheel', (e) => {
    if (e.deltaY === 0) return;
    e.preventDefault();
    thumbnailsContainer.scrollLeft += e.deltaY;
}, { passive: false });





const menu = document.getElementById('context-menu');

// Variabili per larghezza e altezza del menu
let menuWidth = 0;
let menuHeight = 0;

// Al caricamento, misuriamo il menu e lo nascondiamo
window.addEventListener('DOMContentLoaded', () => {
    menu.style.display = 'block';
    menuWidth = menu.offsetWidth;
    menuHeight = menu.offsetHeight;
    menu.style.display = 'none';
});

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();

    // Coordinate iniziali (pagina + scroll)
    let x = e.pageX;
    let y = e.pageY;
    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;

    // Dimensioni viewport (senza scroll)
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;

    // Se sfora a destra, lo riallineiamo al bordo destro
    if (x - scrollX + menuWidth > viewportWidth) {
        x = scrollX + viewportWidth - menuWidth;
        if (x < scrollX) x = scrollX;
    }

    // Se sfora in basso, lo riallineiamo al bordo inferiore
    if (y - scrollY + menuHeight > viewportHeight) {
        y = scrollY + viewportHeight - menuHeight;
        if (y < scrollY) y = scrollY;
    }

    // Applichiamo posizione e mostriamo il menu
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;
    menu.style.display = 'block';
});

// Al click esterno, nascondiamo il menu
document.addEventListener('click', function () {
    menu.style.display = 'none';
});
