const videos = [
    {
        title: "Trama",
        src: "static/tutorial/trama.mp4",
        thumbnail: "static/tutorial/trama_anteprima.png"
    },
    {
        title: "Informazioni generali",
        src: "", // nessun video disponibile
        thumbnail: "static/tutorial/coming_soon.jpeg"
    },
    {
        title: "Componenti",
        src: "",
        thumbnail: "static/tutorial/coming_soon.jpeg"
    },
    {
        title: "Divinità",
        src: "",
        thumbnail: "static/tutorial/coming_soon.jpeg"
    },
    {
        title: "Plancia",
        src: "",
        thumbnail: "static/tutorial/coming_soon.jpeg"
    },
    {
        title: "Fasi di gioco",
        src: "",
        thumbnail: "static/tutorial/coming_soon.jpeg"
    },
    {
        title: "Movimento",
        src: "",
        thumbnail: "static/tutorial/coming_soon.jpeg"
    },
    {
        title: "Paradiso e inferno",
        src: "",
        thumbnail: "static/tutorial/coming_soon.jpeg"
    },
    {
        title: "Carte miracolo",
        src: "",
        thumbnail: "static/tutorial/coming_soon.jpeg"
    },
    {
        title: "Carte oggetto",
        src: "",
        thumbnail: "static/tutorial/coming_soon.jpeg"
    },
    {
        title: "Il folle",
        src: "",
        thumbnail: "static/tutorial/coming_soon.jpeg"
    },
    {
        title: "Battaglia",
        src: "",
        thumbnail: "static/tutorial/coming_soon.jpeg"
    },
    {
        title: "Regole generali",
        src: "",
        thumbnail: "static/tutorial/coming_soon.jpeg"
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

// howToPlay.js

function loadVideo(index) {
    if (index < 0 || index >= videos.length) return;

    const video = videos[index];

    // 1) Rimuovi animazioni precedenti
    videoPlayer.classList.remove('fade-in');
    videoPlayer.classList.add('fade');

    setTimeout(() => {
        currentVideoIndex = index;

        // Aggiorna titolo e contatore
        videoTitle.textContent = video.title;
        currentEl.textContent = index + 1;

        // Disabilita/abilita i pulsanti Prev/Next
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === videos.length - 1;

        // Evidenzia miniatura attiva
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        // 2) Se esiste un video valido (src !== ""), lo mostro; altrimenti mostro solo l'immagine
        if (video.src && video.src.trim() !== "") {
            // Caso "Trama" (con video):
            // - Mostro il <video>
            videoPlayer.style.display = 'block';
            // - Nascondo l'<img> placeholder
            document.getElementById('videoPlaceholder').style.display = 'none';

            // Imposto la sorgente del video e lo ricarico
            videoPlayer.src = video.src;
            videoPlayer.load();
        } else {
            // Caso "Coming Soon" (senza video):
            // - Nascondo il <video> (così non si vede l'area vuota)
            videoPlayer.style.display = 'none';
            // - Mostro l'<img> con la thumbnail (coming_soon.jpeg)
            const placeholder = document.getElementById('videoPlaceholder');
            placeholder.src = video.thumbnail;
            placeholder.style.display = 'block';
        }

        // 3) Riapplica la classe fade-in (fade-in su chi è visibile)
        //    Applichiamo fade-in a tutto il contenitore video, ma la creazione
        //    dell'opacità riguarda l'elemento correntemente visibile.
        videoPlayer.classList.remove('fade');
        videoPlayer.classList.add('fade-in');
        document.getElementById('videoPlaceholder').classList.remove('fade');
        document.getElementById('videoPlaceholder').classList.add('fade-in');

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



document.getElementById('burger-navbar').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});
