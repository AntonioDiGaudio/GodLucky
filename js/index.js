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





document.addEventListener('DOMContentLoaded', function() {
  // Gestione navbar mobile
  const burgerNavbar = document.getElementById('burger-navbar');
  const navLinks = document.getElementById('navLinks');
  
  if (burgerNavbar && navLinks) {
    burgerNavbar.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // Gestione blog
  const blogContainer = document.getElementById('blog-container');
  const loadMoreBtn = document.getElementById('load-more-btn');
  
  let articles = [];
  let currentIndex = 0;
  const articlesPerLoad = 1;

  // Funzione per caricare gli articoli dal JSON
  async function fetchArticles() {
    try {
      const response = await fetch('data/blog.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      articles = await response.json();
      
      // Ordinamento per data (dal più recente)
      articles.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Carica i primi articoli
      loadArticles();
    } catch (error) {
      console.error('Error fetching blog articles:', error);
      blogContainer.innerHTML = `<p class="error-message">Impossibile caricare gli articoli del blog. Riprova più tardi.</p>`;
    }
  }

  function loadArticles() {
    const endIndex = Math.min(currentIndex + articlesPerLoad, articles.length);
    
    for (; currentIndex < endIndex; currentIndex++) {
      const article = articles[currentIndex];
      const articleEl = document.createElement('article');
      articleEl.classList.add('blog-article');
      
      // Formatta la data
      const dateObj = new Date(article.date);
      const formattedDate = dateObj.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      articleEl.innerHTML = `
        <div class="article-header">
          <h2>${article.title}</h2>
          <div class="article-meta">
            <span class="article-date">${formattedDate}</span>
            <span class="article-subtitle">${article.subtitle}</span>
          </div>
        </div>
        <div class="blog-article-content">${article.content}</div>
      `;
      blogContainer.appendChild(articleEl);
    }

    // Mostra/nascondi il pulsante
    loadMoreBtn.style.display = currentIndex < articles.length ? 'block' : 'none';
  }

  // Inizializza il blog
  fetchArticles();

  // Gestione click sul pulsante
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadArticles);
  }
});