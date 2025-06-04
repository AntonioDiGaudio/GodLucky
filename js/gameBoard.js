const characters = [
  { name: "Lord Under", image: "static/images/game_board_asset/LordUnder.png", initialCorruzione: 8 },
  { name: "Nirvanello", image: "static/images/game_board_asset/Nirvanello.png", initialCorruzione: 2 },
  { name: "WaterWalker", image: "static/images/game_board_asset/WaterWalker.png", initialCorruzione: 2 },
  { name: "Morphyss", image: "static/images/game_board_asset/Morphyss.png", initialCorruzione: 8 },
  { name: "BlackSarcophagus", image: "static/images/game_board_asset/BlackSarcophagus.png", initialCorruzione: 8 },
  { name: "SilentDreamer", image: "static/images/game_board_asset/SilentDreamer.png", initialCorruzione: 2 }
];

const BUTTONS_PER_GROUP = 10;
const container = document.getElementById('columnsContainer');
const logBox = document.getElementById("log");

// Stato fede/corruzione per ogni personaggio
const characterStates = characters.map((char) => ({
  fede: 5,
  corruzione: char.initialCorruzione
}));

// Costruzione interfaccia
characters.forEach((character, i) => {
  const macroCol = document.createElement('div');
  macroCol.className = 'macro-column';
  macroCol.dataset.macroId = `macro-${i}`;

  const img = document.createElement('img');
  img.src = character.image;
  img.alt = character.name;
  macroCol.appendChild(img);

  const title = document.createElement('div');
  title.className = 'macro-column-title';
  title.innerText = character.name;
  macroCol.appendChild(title);

  const innerColumns = document.createElement('div');
  innerColumns.className = 'inner-columns';

  // Immagini fede e corruzione sopra le colonne
  const iconRow = document.createElement('div');
  iconRow.className = 'inner-columns';

  ["fede.png", "corruzione.png"].forEach(src => {
    const iconWrap = document.createElement('div');
    iconWrap.style.textAlign = "center";
    iconWrap.style.width = "50%";
    const icon = document.createElement('img');
    icon.src = `static/images/game_board_asset/${src}`;
    icon.alt = src.split(".")[0];
    icon.style.width = "50px";
    iconWrap.appendChild(icon);
    iconRow.appendChild(iconWrap);
  });
  macroCol.appendChild(iconRow);

  // Bottoni fede e corruzione
  for (let j = 0; j < 2; j++) {
    const colId = `${i}-${j}`;
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    buttonGroup.dataset.colId = colId;

    for (let k = 1; k <= BUTTONS_PER_GROUP; k++) {
      const btn = document.createElement('button');
      btn.innerText = k;
      btn.dataset.colId = colId;
      btn.dataset.index = k;
      btn.onclick = handleClick;
      buttonGroup.appendChild(btn);
    }

    innerColumns.appendChild(buttonGroup);
  }

  macroCol.appendChild(innerColumns);
  container.appendChild(macroCol);
});

// Gestione click bottoni
function handleClick(e) {
  const btn = e.target;
  const colId = btn.dataset.colId;
  const btnIndex = parseInt(btn.dataset.index);
  const [macroIndex, subIndex] = colId.split('-').map(Number);

  // 1) Leggo lo stato salvato (o creo un oggetto vuoto se non esiste)
  let state = JSON.parse(localStorage.getItem('buttonState')) || {};
  // 2) Controllo se il bottone cliccato è già quello attivo
  const alreadyActive = state[colId] === btnIndex;
  if (alreadyActive) {
    // Se è già attivo, non faccio nulla (rimane selezionato)
    return;
  }

  // 3) Altrimenti, rimuovo 'active' da tutti i bottoni di quella colonna
  const buttons = document.querySelectorAll(
    `.button-group[data-col-id="${colId}"] button`
  );
  buttons.forEach(b => b.classList.remove('active'));

  // 4) Aggiungo 'active' al bottone cliccato e aggiorno lo stato
  btn.classList.add('active');
  state[colId] = btnIndex;
  localStorage.setItem('buttonState', JSON.stringify(state));

  // 5) Aggiorno characterStates e stampo il log solo se c’è un cambiamento
  const isFede = subIndex === 0;
  const statType = isFede ? 'fede' : 'corruzione';
  const prevValue = characterStates[macroIndex][statType];
  const newValue = btnIndex;

  if (prevValue !== newValue) {
    characterStates[macroIndex][statType] = newValue;
    localStorage.setItem('characterStates', JSON.stringify(characterStates));
    logChange(macroIndex, statType, prevValue, newValue);
  }
}


// Logging cambiamenti
function logChange(index, statType, from, to) {
  const character = characters[index];

  // Creo il div del log
  const line = document.createElement("div");
  line.innerHTML = `
    <span class="log-character">${character.name}</span>
    ha cambiato punti
    <span class="log-${statType}">${statType}</span>
    da ${from} a ${to}
  `;

  // Creo un <hr> come divisore
  const divider = document.createElement("hr");
  divider.style.border = "none";
  divider.style.height = "1px";
  divider.style.backgroundColor = "#ccc";  // colore grigio chiaro

  // Inserisco prima il <div> e subito dopo l’<hr> in cima al logBox
  logBox.insertBefore(divider, logBox.firstChild);
  logBox.insertBefore(line, logBox.firstChild);
}

// Caricamento da localStorage
function loadState() {
  const savedState = JSON.parse(localStorage.getItem('buttonState')) || {};
  const savedStats = JSON.parse(localStorage.getItem('characterStates'));

  if (savedStats) {
    savedStats.forEach((s, i) => {
      characterStates[i] = s;
    });
  }

  // Se non ci sono stati salvati, impostiamo quelli iniziali
  if (Object.keys(savedState).length === 0) {
    characters.forEach((char, i) => {
      const fedeValue = characterStates[i].fede;
      const corruzioneValue = characterStates[i].corruzione;

      const fedeBtn = document.querySelector(`.button-group[data-col-id="${i}-0"] button[data-index="${fedeValue}"]`);
      const corruzioneBtn = document.querySelector(`.button-group[data-col-id="${i}-1"] button[data-index="${corruzioneValue}"]`);

      if (fedeBtn) fedeBtn.classList.add('active');
      if (corruzioneBtn) corruzioneBtn.classList.add('active');

      // Salviamo lo stato iniziale anche su localStorage
      savedState[`${i}-0`] = fedeValue;
      savedState[`${i}-1`] = corruzioneValue;
    });

    localStorage.setItem('buttonState', JSON.stringify(savedState));
    localStorage.setItem('characterStates', JSON.stringify(characterStates));
  } else {
    // Se esiste già uno stato salvato, lo applichiamo ai bottoni
    for (const [colId, btnIndex] of Object.entries(savedState)) {
      const btn = document.querySelector(
        `.button-group[data-col-id="${colId}"] button[data-index="${btnIndex}"]`
      );
      if (btn) btn.classList.add('active');
    }
  }
}


// Reset
function resetAll() {
  document.querySelectorAll('.button-group button').forEach(btn => {
    btn.classList.remove('active');
  });

  localStorage.removeItem('buttonState');
  localStorage.removeItem('characterStates');
  logBox.innerHTML = '';

  characters.forEach((char, i) => {
    characterStates[i] = {
      fede: 5,
      corruzione: char.initialCorruzione
    };
  });

  loadState(); // <-- Richiama per aggiornare i bottoni premuti in base ai valori iniziali
}


loadState();




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



// Al click esterno, nascondiamo il menu
document.addEventListener('click', function () {
    menu.style.display = 'none';
});



document.getElementById('burger-navbar').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});



const clearBtn = document.getElementById('clearGameBtn');
const modalOverlay = document.getElementById('confirmModal');
const confirmBtn = document.getElementById('confirmClear');
const cancelBtn = document.getElementById('cancelClear');





clearBtn.addEventListener('click', function(event) {
  event.preventDefault();
  modalOverlay.style.display = 'flex';
});

modalOverlay.addEventListener('click', function(e) {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = 'none';
  }
});

cancelBtn.addEventListener('click', function() {
  modalOverlay.style.display = 'none';
});

confirmBtn.addEventListener('click', function() {
  modalOverlay.style.display = 'none';
  resetAll();
});
