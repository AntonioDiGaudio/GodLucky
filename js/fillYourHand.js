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

  // Spacing che si dimezza ogni 5 carte
  const baseSpacing = 30;
  const step = Math.floor((total - 1) / 5); // ogni 5 carte
  const spacing = Math.max(3, baseSpacing / Math.pow(2, step)); // dimezza ogni step

  mano.forEach((card, index) => {
    const angle = (index - center) * (spread / total);
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.style.transform = `rotate(${angle}deg) translateY(${Math.abs(angle) * 0.6}px)`;

    cardEl.style.left = `calc(50% - 40px + ${(index - center) * spacing}px)`;
    cardEl.style.backgroundImage = `url('${card.flipped ? card.back : card.front}')`;

    let holdTimer;
    let wasHeld = false;

    const startHold = () => {
      wasHeld = false;
      holdTimer = setTimeout(() => {
        wasHeld = true;
        const isMobile = window.innerWidth <= 768;
        cardEl.style.transform = `scale(3)`;
        cardEl.style.position = 'fixed';
        cardEl.style.top = '60%';
        cardEl.style.left = isMobile ? '40%' : '50%';
        cardEl.style.zIndex = 999;
      }, 500);
    };

    const endHold = () => {
      clearTimeout(holdTimer);
      if (!wasHeld) {
        card.flipped = !card.flipped;
      }
      renderHand();
    };

    cardEl.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startHold();
    });

    cardEl.addEventListener("mouseup", endHold);

    cardEl.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startHold();
    });

    cardEl.addEventListener("touchend", endHold);

    hand.appendChild(cardEl);
  });
}




function renderMiracoli() {
  for (let i = 0; i < 7; i++) {
    const slot = document.getElementById(`mir${i + 1}`);
    const card = miracoli[i];

    if (card) {
      slot.style.backgroundImage = `url('${card.flipped ? card.back : card.front}')`;

      slot.replaceWith(slot.cloneNode(true));
      const newSlot = document.getElementById(`mir${i + 1}`);

      let holdTimer;
      let isHold = false;

      const handleFlip = () => {
        card.flipped = !card.flipped;
        renderMiracoli();
      };

      const startZoom = (e) => {
        e.preventDefault();
        isHold = false;
        holdTimer = setTimeout(() => {
          isHold = true;
          newSlot.style.transform = "scale(3)";
          newSlot.style.zIndex = "999";
        }, 300);
      };

      const endZoom = () => {
        clearTimeout(holdTimer);
        if (isHold) {
          newSlot.style.transform = "";
          newSlot.style.zIndex = "";
        }
      };

      newSlot.addEventListener('click', (e) => {
        if (!isHold) handleFlip(e);
      });

      newSlot.addEventListener('touchend', (e) => {
        if (!isHold) handleFlip(e);
      });

      newSlot.addEventListener('mousedown', startZoom);
      newSlot.addEventListener('mouseup', endZoom);
      newSlot.addEventListener('mouseleave', endZoom);

      newSlot.addEventListener('touchstart', startZoom, { passive: false });
      newSlot.addEventListener('touchmove', endZoom);
      newSlot.addEventListener('touchend', endZoom);
      newSlot.addEventListener('touchcancel', endZoom);
    } else {
      slot.style.backgroundImage = "";
      const newSlot = slot.cloneNode(true);
      slot.replaceWith(newSlot);
    }
  }
}



function renderPersonaggio() {
  const slot = document.getElementById("personaggio");

  if (personaggio) {
    slot.style.backgroundImage = `url('${personaggio.flipped ? personaggio.back : personaggio.front}')`;

    slot.replaceWith(slot.cloneNode(true));
    const newSlot = document.getElementById("personaggio");

    let holdTimer;
    let isHold = false;

    const handleFlip = () => {
      personaggio.flipped = !personaggio.flipped;
      renderPersonaggio();
    };

    const startZoom = (e) => {
      e.preventDefault();
      isHold = false;
      holdTimer = setTimeout(() => {
        isHold = true;
        newSlot.style.transform = "scale(3)";
        newSlot.style.zIndex = "999";
      }, 300);
    };

    const endZoom = () => {
      clearTimeout(holdTimer);
      if (isHold) {
        newSlot.style.transform = "";
        newSlot.style.zIndex = "";
      }
    };

    newSlot.addEventListener('click', (e) => {
      if (!isHold) handleFlip(e);
    });

    newSlot.addEventListener('touchend', (e) => {
      if (!isHold) handleFlip(e);
    });

    newSlot.addEventListener('mousedown', startZoom);
    newSlot.addEventListener('mouseup', endZoom);
    newSlot.addEventListener('mouseleave', endZoom);

    newSlot.addEventListener('touchstart', startZoom, { passive: false });
    newSlot.addEventListener('touchmove', endZoom);
    newSlot.addEventListener('touchend', endZoom);
    newSlot.addEventListener('touchcancel', endZoom);

  } else {
    slot.style.backgroundImage = "";
    const newSlot = slot.cloneNode(true);
    slot.replaceWith(newSlot);
  }
}



// ----- AGGIUNTA -----
function addCard(tipo, numero) {
  const { front, back } = getCardPaths(tipo, numero);
  const card = { tipo, numero, front, back, flipped: false };

  if (tipo === "oggetto") {
    if (mano.length >= 30) return showAlert("Non puoi avere più di 30 oggetti nella mano!");
    if (mano.find(c => c.tipo === "oggetto" && c.numero === numero)) {
      return showAlert("Hai già questa carta oggetto nella mano!");
    }
    mano.push(card);
    renderHand();
    closeModal(); // Aggiunto qui
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
      closeModal(); // Aggiunto qui
    }
  }

  else if (tipo === "personaggio") {
    if (personaggio !== null) {
      showAlert("Hai già un personaggio! Rimuovilo prima.");
      return; // Aggiunto return per evitare esecuzione successiva
    }
    personaggio = card;
    renderPersonaggio();
    closeModal(); // Aggiunto qui
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
  if (tipo === "oggetto") {
    mano.forEach((card, index) => {
      const btn = document.createElement("button");
      btn.textContent = `${card.tipo} ${card.numero}`;
      btn.onclick = () => {
        mano.splice(index, 1);
        renderHand();
        closeModal();
      };
      modalContent.appendChild(btn);
    });
  }

  if (tipo === "miracolo") {
    miracoli.forEach((card, i) => {
      if (card) {
        const btn = document.createElement("button");
        btn.textContent = `${card.tipo} ${card.numero}`;
        btn.onclick = () => {
          miracoli[i] = null;
          renderMiracoli();
          closeModal();
        };
        modalContent.appendChild(btn);
      }
    });
  }

  if (tipo === "personaggio") {
    const btn = document.createElement("button");
    btn.textContent = `${personaggio.tipo} ${personaggio.numero}`;
    btn.onclick = () => {
      personaggio = null;
      renderPersonaggio();
      closeModal(); // Assicurati che venga chiamato
    };
    modalContent.appendChild(btn);
  }
}


// ----- AGGIUNTA -----
function showAdd(tipo) {
  modal.style.display = "flex";

  modalContent.innerHTML = `<h3>Seleziona un ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h3>`;
  const max = tipo === "oggetto" ? 30 : tipo === "miracolo" ? 7 : 6; // 6 personaggi disponibili

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

// ----- MODAL -----
function closeModal() {
  modal.style.display = "none";
  modalContent.innerHTML = ""; // Pulisci il contenuto
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
