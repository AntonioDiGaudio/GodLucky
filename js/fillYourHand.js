const hand = document.getElementById("hand");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

let mano = [];
let miracoli = new Array(7).fill(null);
let personaggio = null;

// ----- PERSISTENZA -----
window.addEventListener("beforeunload", saveState);
window.addEventListener("DOMContentLoaded", loadState);

function showAlert(message) {
  const alertBox = document.getElementById("custom-alert");
  alertBox.textContent = message;
  alertBox.classList.add("show");
  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 2500);
}

// ----- UTILITY PATH -----
function getCardPaths(tipo, numero) {
  let folder = tipo === "miracolo" ? "miracoli" :
               tipo === "personaggio" ? "personaggi" : "oggetto";

  let front = `/cards/${folder}/${tipo}${numero}.png`;
  let back;

  if (tipo === "oggetto") {
      back = numero >= 25 ? `/cards/${folder}/oggettoSacroBack.png` : `/cards/${folder}/oggettoBack.png`;
  } else if (tipo === "miracolo") {
    back = `/cards/${folder}/miracoloBack.png`;
  } else if (tipo === "personaggio") {
    back = `/cards/${folder}/personaggioBack${numero}.png`;
  }

  return { front, back };
}

// ----- RENDER -----
function renderHand() {
  hand.innerHTML = "";
  const total = mano.length;

  const spread = Math.min(60, 1200 / total);
  const center = (total - 1) / 2;
  const baseSpacing = 30;
  const step = Math.floor((total - 1) / 5);
  const spacing = Math.max(3, baseSpacing / Math.pow(2, step));

  mano.forEach((card, index) => {
    const angle = (index - center) * (spread / total);
    const cardEl = document.createElement("div");
    cardEl.className = `card ${card.new ? 'fade-in' : ''}`;
    cardEl.style.transform = `rotate(${angle}deg) translateY(${Math.abs(angle) * 0.6}px)`;
    cardEl.style.left = `calc(50% - 40px + ${(index - center) * spacing}px)`;
    delete card.new; // Rimuove il flag dopo il primo render

    const cardInner = document.createElement("div");
    cardInner.className = "card-inner";
    if (card.flipped) cardInner.style.transform = "rotateY(180deg)";

    const front = document.createElement("div");
    front.className = "card-front";
    front.style.backgroundImage = `url('${card.front}')`;

    const back = document.createElement("div");
    back.className = "card-back";
    back.style.backgroundImage = `url('${card.back}')`;

    cardInner.appendChild(front);
    cardInner.appendChild(back);
    cardEl.appendChild(cardInner);

    let holdTimer;
    let wasHeld = false;

    // Modifica nella funzione renderHand
      const startHold = () => {
      wasHeld = false;
      holdTimer = setTimeout(() => {
          wasHeld = true;

          // Calcola la posizione del centro rispetto alla viewport
          const cardRect = cardEl.getBoundingClientRect();
          
          // Coordinate centro carta
          const cardCenterX = cardRect.left + cardRect.width / 2;
          const cardCenterY = cardRect.top + cardRect.height / 2;
          
          // Coordinate centro schermo
          const targetX = window.innerWidth / 2;
          const targetY = window.innerHeight / 2;
          
          // Differenza da compensare
          const deltaX = targetX - cardCenterX;
          const deltaY = targetY - cardCenterY;

          // Salva stato originale
          cardEl.dataset.originalTransform = cardEl.style.transform;
          cardEl.dataset.originalTransformOrigin = cardEl.style.transformOrigin;

          // Applica trasformazioni
          cardEl.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          cardEl.style.transformOrigin = 'center'; // Importante per lo scaling
          cardEl.style.transform = `
              translate(${deltaX}px, ${deltaY}px) 
              scale(3) 
              rotate(0deg)
          `;
          cardEl.style.zIndex = '999';

      }, 500);
  };

      const endHold = () => {
        clearTimeout(holdTimer);
        
        if (wasHeld) {
          // Ripristina la trasformazione originale
          cardEl.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          cardEl.style.transform = cardEl.dataset.originalTransform;
          
          setTimeout(() => {
            cardEl.style.transition = '';
            cardEl.style.zIndex = '';
            delete cardEl.dataset.originalTransform;
          }, 300);
        } else {
        // Gestione flip normale
        cardInner.style.transform = card.flipped ? "rotateY(0deg)" : "rotateY(180deg)";
        card.flipped = !card.flipped;
      }
    };

      const handleRelease = () => {
        endHold();
        document.removeEventListener('mouseup', handleRelease);
        document.removeEventListener('touchend', handleRelease);
      };

      cardEl.addEventListener("mousedown", (e) => {
        e.preventDefault();
        document.addEventListener('mouseup', handleRelease);
        startHold();
      });

      cardEl.addEventListener("touchstart", (e) => {
        e.preventDefault();
        document.addEventListener('touchend', handleRelease);
        startHold();
      });

    hand.appendChild(cardEl);
  });
}

function renderMiracoli() {
  for (let i = 0; i < 7; i++) {
    const slot = document.getElementById(`mir${i + 1}`);
    const card = miracoli[i];

    if (card) {
      slot.innerHTML = '';
      const cardInner = document.createElement("div");
      cardInner.className = "card-inner";
      if (card.flipped) cardInner.style.transform = "rotateY(180deg)";

      const front = document.createElement("div");
      front.className = "card-front";
      front.style.backgroundImage = `url('${card.front}')`;

      const back = document.createElement("div");
      back.className = "card-back";
      back.style.backgroundImage = `url('${card.back}')`;

      cardInner.appendChild(front);
      cardInner.appendChild(back);
      slot.appendChild(cardInner);

      let holdTimer;
      let isHold = false;

      const handleFlip = () => {
        cardInner.style.transform = card.flipped ? "rotateY(0deg)" : "rotateY(180deg)";
        card.flipped = !card.flipped;
      };

      const startZoom = (e) => {
        e.preventDefault();
        isHold = false;
        holdTimer = setTimeout(() => {
          isHold = true;
          slot.style.transform = "scale(3) translateZ(100px)";
          slot.style.zIndex = "999";
        }, 300);
      };

      const endZoom = () => {
        clearTimeout(holdTimer);
        if (isHold) {
          slot.style.transform = "";
          slot.style.zIndex = "";
        }
      };

      slot.onclick = (e) => !isHold && handleFlip();
      slot.ontouchend = (e) => !isHold && handleFlip();
      slot.addEventListener('mousedown', startZoom);
      slot.addEventListener('mouseup', endZoom);
      slot.addEventListener('touchstart', startZoom, { passive: false });
      slot.addEventListener('touchend', endZoom);

    } else {
      slot.innerHTML = '';
      slot.style.transform = "";
    }
  }
}

function renderPersonaggio() {
  const slot = document.getElementById("personaggio");
  slot.innerHTML = '';

  if (personaggio) {
    const cardInner = document.createElement("div");
    cardInner.className = "card-inner";
    if (personaggio.flipped) cardInner.style.transform = "rotateY(180deg)";

    const front = document.createElement("div");
    front.className = "card-front";
    front.style.backgroundImage = `url('${personaggio.front}')`;

    const back = document.createElement("div");
    back.className = "card-back";
    back.style.backgroundImage = `url('${personaggio.back}')`;

    cardInner.appendChild(front);
    cardInner.appendChild(back);
    slot.appendChild(cardInner);

    let holdTimer;
    let isHold = false;

    const handleFlip = () => {
      cardInner.style.transform = personaggio.flipped ? "rotateY(0deg)" : "rotateY(180deg)";
      personaggio.flipped = !personaggio.flipped;
    };

    const startZoom = (e) => {
      e.preventDefault();
      isHold = false;
      holdTimer = setTimeout(() => {
        isHold = true;
        slot.style.transform = "scale(3) translateZ(100px)";
        slot.style.zIndex = "999";
      }, 300);
    };

    const endZoom = () => {
      clearTimeout(holdTimer);
      if (isHold) {
        slot.style.transform = "";
        slot.style.zIndex = "";
      }
    };

    slot.onclick = (e) => !isHold && handleFlip();
    slot.ontouchend = (e) => !isHold && handleFlip();
    slot.addEventListener('mousedown', startZoom);
    slot.addEventListener('mouseup', endZoom);
    slot.addEventListener('touchstart', startZoom, { passive: false });
    slot.addEventListener('touchend', endZoom);
  }
}

// ----- AGGIUNTA -----
function addCard(tipo, numero) {
  const { front, back } = getCardPaths(tipo, numero);
  const card = { 
    tipo, 
    numero, 
    front, 
    back, 
    flipped: false,
    new: true // Flag per animazione fade-in
  };

  if (tipo === "oggetto") {
    if (mano.length >= 30) return showAlert("Non puoi avere più di 30 oggetti nella mano!");
    if (mano.find(c => c.tipo === "oggetto" && c.numero === numero)) {
      return showAlert("Hai già questa carta oggetto nella mano!");
    }
    mano.push(card);
    renderHand();
    closeModal();
  }
  else if (tipo === "miracolo") {
    if (miracoli.filter(m => m).length >= 7) return showAlert("Non puoi avere più di 7 miracoli!");
    if (miracoli.find(m => m && m.numero === numero)) {
      return showAlert("Hai già questo miracolo!");
    }
    const emptyIndex = miracoli.findIndex(m => m === null);
    if (emptyIndex !== -1) {
      miracoli[emptyIndex] = card;
      renderMiracoli();
      closeModal();
    }
  }
  else if (tipo === "personaggio") {
    if (personaggio !== null) {
      showAlert("Hai già un personaggio! Rimuovilo prima.");
      return;
    }
    personaggio = card;
    renderPersonaggio();
    closeModal();
  }
}




// ----- AGGIUNTA CARTA -----
function showAdd(tipo) {
  modal.style.display = "flex";
  modalContent.innerHTML = `<h3>Seleziona un ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h3>`;
  const max = tipo === "oggetto" ? 30 : 
             tipo === "miracolo" ? 7 : 
             6; // 6 personaggi

  for (let i = 1; i <= max; i++) {
    const btn = document.createElement("button");
    btn.textContent = `${tipo} ${i}`;
    btn.onclick = () => {
      addCard(tipo, i);
      closeModal();
    };
    modalContent.appendChild(btn);
  }
}



function showRemove(tipo) {
  if (tipo === "oggetto" && mano.length === 0) {
    return showAlert("Non hai oggetti da rimuovere!");
  }
  if (tipo === "miracolo" && miracoli.filter(Boolean).length === 0) {
    return showAlert("Non hai miracoli da rimuovere!");
  }
  if (tipo === "personaggio" && !personaggio) {
    return showAlert("Non hai personaggio da rimuovere!");
  }

  modal.style.display = "flex";
  modalContent.innerHTML = `<h3>Rimuovi un ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h3>`;

 const animateAndRemove = (element, callback) => {
    const cardInner = element.querySelector('.card-inner');
    if (!cardInner) return;
    
    cardInner.classList.add("destroying");
    cardInner.addEventListener('animationend', () => {
      element.innerHTML = ''; // Svuota il contenitore
      callback();
    }, { once: true });
  };

    if (tipo === "oggetto") {
    mano.forEach((card, index) => {
      const btn = document.createElement("button");
      btn.textContent = `${card.tipo} ${card.numero}`;
      btn.onclick = () => {
        // Trova la carta corretta usando l'ID univoco
        const cardEl = Array.from(hand.children).find(el => 
          el.querySelector('.card-front')?.style.backgroundImage.includes(`oggetto${card.numero}.png`)
        );
        
        if (!cardEl) return;
        
        cardEl.style.transition = 'none'; // Disabilita transizioni
        cardEl.classList.add("destroying");
        
        cardEl.addEventListener('animationend', () => {
          mano.splice(index, 1);
          renderHand();
          closeModal();
        }, { once: true });
      };
      modalContent.appendChild(btn);
    });
  }

  // Miracoli
  if (tipo === "miracolo") {
    miracoli.forEach((card, i) => {
      if (card) {
        const btn = document.createElement("button");
        btn.textContent = `${card.tipo} ${card.numero}`;
        btn.onclick = () => {
          const slot = document.getElementById(`mir${i + 1}`);
          animateAndRemove(slot, () => {
            miracoli[i] = null;
            renderMiracoli(); // Ricarica lo stato normale
            closeModal();
          });
        };
        modalContent.appendChild(btn);
      }
    });
  }

  // Personaggio
  if (tipo === "personaggio") {
    const btn = document.createElement("button");
    btn.textContent = `${personaggio.tipo} ${personaggio.numero}`;
    btn.onclick = () => {
      const slot = document.getElementById("personaggio");
      animateAndRemove(slot, () => {
        personaggio = null;
        renderPersonaggio(); // Ricarica lo stato normale
        closeModal();
      });
    };
    modalContent.appendChild(btn);
  }
}


// ----- MODAL -----
function closeModal() {
  modal.style.display = "none";
  modalContent.innerHTML = "";
}

// ----- RESET -----
function clearGame() {
  if (confirm("Vuoi davvero pulire la partita?")) {
    mano = [];
    miracoli = new Array(7).fill(null);
    personaggio = null;
    renderHand();
    renderMiracoli();
    renderPersonaggio();
    localStorage.clear();
  }
}

// ----- STORAGE -----
function saveState() {
  localStorage.setItem("mano", JSON.stringify(mano));
  localStorage.setItem("miracoli", JSON.stringify(miracoli));
  localStorage.setItem("personaggio", JSON.stringify(personaggio));
}

function loadState() {
  const savedHand = localStorage.getItem("mano");
  const savedMiracoli = localStorage.getItem("miracoli");
  const savedPersonaggio = localStorage.getItem("personaggio");

  if (savedHand) mano = JSON.parse(savedHand);
  if (savedMiracoli) miracoli = JSON.parse(savedMiracoli);
  if (savedPersonaggio) personaggio = JSON.parse(savedPersonaggio);

  renderHand();
  renderMiracoli();
  renderPersonaggio();
}

// ----- MODAL OUT -----
modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

// ----- INFO -----
function showInfo() {
  modal.style.display = "flex";
  modalContent.innerHTML = `
  <h3>Funzionalità</h3>
  <ul>
    <li>Tenere premuto fa zoomare sulla carta</li>
    <li>Un click fa girare la carta</li>
    <li>Se si esce dalla pagina, al rientro i dati saranno salvati,per eliminarli cliccare su "Pulisci partita"</li>
    <li>Non si possono avere carte uguali.</li>
  </ul>`;
}

function toggleMenu() {
  const menu = document.getElementById("menuButtons");
  const container = document.querySelector(".menu-container");
  menu.classList.toggle("show");
  container.classList.toggle("open");
}

function goHome(){
  window.location.href = '/index.html';
}