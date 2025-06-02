const coin = document.getElementById('coin');
const coinImg = document.getElementById('coinImg');
const result = document.getElementById('result');
const d6Cube = document.getElementById('d6cube');
const d3Cube = document.getElementById('d3cube');

// Imposta l'immagine di default per la moneta
coinImg.style.backgroundImage = "url('static/images/coin/monetaDefault.png')";

// Crea un numero centrato per la faccia del dado
function createDiceNumber(face, num) {
  face.innerHTML = '';
  const number = document.createElement('div');
  number.textContent = num;
  number.style.display = 'flex';
  number.style.justifyContent = 'center';
  number.style.alignItems = 'center';
  number.style.fontSize = '40px';
  number.style.fontWeight = 'bold';
  number.style.height = '100%';
  face.appendChild(number);
}

// Inizializza i dadi con numeri
function initDice() {
  const d6Faces = d6Cube.querySelectorAll('.dice-face');
  createDiceNumber(d6Faces[0], 1);
  createDiceNumber(d6Faces[1], 6);
  createDiceNumber(d6Faces[2], 3);
  createDiceNumber(d6Faces[3], 4);
  createDiceNumber(d6Faces[4], 5);
  createDiceNumber(d6Faces[5], 2);

  const d3Faces = d3Cube.querySelectorAll('.dice-face');
  createDiceNumber(d3Faces[0], 1);
  createDiceNumber(d3Faces[1], 2);
  createDiceNumber(d3Faces[2], 3);
}

initDice();

function flipCoin() {
  const isHead = Math.random() < 0.5;
  let frames = 0;
  const maxFrames = 20;
  const intervalTime = 100;

  // Avvia animazione 3D
  coinImg.classList.remove('flipping');
  void coinImg.offsetWidth; // forza reflow
  coinImg.classList.add('flipping');

  result.textContent = 'La moneta sta girando...';
  result.style.background = "rgba(46, 204, 113, 0.3)";

  const flipInterval = setInterval(() => {
    coinImg.style.backgroundImage = (frames % 2 === 0)
      ? "url('static/images/coin/testa.png')"
      : "url('static/images/coin/croce.png')";
    frames++;
    if (frames >= maxFrames) {
      clearInterval(flipInterval);
      coinImg.style.backgroundImage = isHead
        ? "url('static/images/coin/testa.png')"
        : "url('static/images/coin/croce.png')";
      result.textContent = 'Risultato moneta: ' + (isHead ? 'Testa' : 'Croce');
      result.style.background = "rgba(46, 204, 113, 0.6)";
    }
  }, intervalTime);
}


function addDragEvent(target, actionFn) {
  let startX, startY, dragging = false;

  target.addEventListener('mousedown', e => {
    startX = e.clientX;
    startY = e.clientY;
    dragging = true;
    target.style.transform = 'scale(0.95)';
  });

  document.addEventListener('mousemove', e => {
    if (dragging) {
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if (dx > 5 || dy > 5) {
        actionFn();
        dragging = false;
        target.style.transform = '';
      }
    }
  });

  document.addEventListener('mouseup', e => {
    if (dragging) {
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if (dx < 10 && dy < 10) {
        actionFn();
      }
      dragging = false;
      target.style.transform = '';
    }
  });

  // Supporto per touch
  target.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    dragging = true;
    target.style.transform = 'scale(0.95)';
    // Non bloccare gli eventi click/tap
  });


  document.addEventListener('touchmove', e => {
    if (dragging) {
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - startX);
      const dy = Math.abs(touch.clientY - startY);
      if (dx > 5 || dy > 5) {
        actionFn();
        dragging = false;
        target.style.transform = '';
      }
    }
  });

  document.addEventListener('touchend', e => {
    if (dragging) {
      dragging = false;
      target.style.transform = '';
    }
  });
}

function roll3dDice(cube, sides) {
  const xRand = Math.floor(Math.random() * 24 + 1) * 90;
  const yRand = Math.floor(Math.random() * 24 + 1) * 90;
  cube.style.transition = 'transform 1s ease-in-out';
  cube.style.transform = `rotateX(${xRand}deg) rotateY(${yRand}deg)`;
  return Math.floor(Math.random() * sides) + 1;
}

function rollD6() {
  result.textContent = 'Il dado D6 sta rollando...';
  result.style.background = "rgba(52, 152, 219, 0.3)";
  const resultValue = roll3dDice(d6Cube, 6);
  setTimeout(() => {
    result.textContent = 'Risultato dado: ' + resultValue;
    result.style.background = "rgba(52, 152, 219, 0.6)";
  }, 1000);
}

function rollD3() {
  result.textContent = 'Il dado D3 sta rollando...';
  result.style.background = "rgba(155, 89, 182, 0.3)";
  const resultValue = roll3dDice(d3Cube, 3);
  setTimeout(() => {
    result.textContent = 'Risultato dado: ' + resultValue;
    result.style.background = "rgba(155, 89, 182, 0.6)";
  }, 1000);
}

// Aggiungi eventi di trascinamento
addDragEvent(document.getElementById('coin'), flipCoin);
addDragEvent(document.getElementById('d6'), rollD6);
addDragEvent(document.getElementById('d3'), rollD3);

// Eventi click per accessibilità
coin.addEventListener('click', flipCoin);
document.getElementById('coin').addEventListener('click', flipCoin);
document.getElementById('d6').addEventListener('click', rollD6);
document.getElementById('d3').addEventListener('click', rollD3);




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
