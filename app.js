const deportes = [
  {
    nombre: 'boxeo',
    pistas: [
      'Es un deporte donde solo puedes golpear con los puños.',
      'Se practica dentro de un ring y se usan guantes gruesos.',
      'Entre sus golpes están el gancho y el uppercut.'
    ]
  },
  {
    nombre: 'esgrima',
    pistas: [
      'Los jugadores deben tocar al oponente sin ser tocados.',
      'Se usan armas como florete, espada o sable.',
      'Los participantes llevan un traje blanco y una careta.'
    ]
  },
  {
    nombre: 'judo',
    pistas: [
      'Se busca derribar o inmovilizar al oponente con proyecciones.',
      'Se usa un uniforme llamado judogi y cinturones de color.',
      'Fue creado en Japón por Jigoro Kano a finales del siglo XIX.'
    ]
  },
  {
    nombre: 'karate',
    pistas: [
      'Incluye técnicas de golpes con manos y pies llamadas kihon.',
      'Se practica con gi blanco y se usan katas.',
      'Su origen está en Okinawa y enfatiza disciplina y control.'
    ]
  },
  {
    nombre: 'taekwondo',
    pistas: [
      'Se caracteriza por patadas rápidas y altas.',
      'Se usan petos electrónicos y cascos para puntuar toques.',
      'Su origen es coreano y tiene formas llamadas poomsae.'
    ]
  }
];

const startBtn = document.getElementById('startBtn');
const hintBtn = document.getElementById('hintBtn');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const welcome = document.getElementById('welcome');
const welcomeStartBtn = document.getElementById('welcomeStartBtn');
const gameCard = document.querySelector('main.card');
const answerInput = document.getElementById('answerInput');
const hintArea = document.getElementById('hintArea');
const feedback = document.getElementById('feedback');
const nudge = document.getElementById('nudge');
const scoreEl = document.getElementById('score');
const roundEl = document.getElementById('round');
const finalModal = document.getElementById('finalModal');
const finalScoreEl = document.getElementById('finalScore');
const finalPhraseEl = document.getElementById('finalPhrase');

let orden = [];
let ronda = 0;
let puntaje = 0;
let deporteActual = null;
let pistaActual = 0;
let intentosFallidos = 0;
let terminado = false;

function mezclar(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizar(s) {
  return (s || '').toLowerCase().trim();
}

function actualizarMarcadores() {
  scoreEl.textContent = String(puntaje);
  roundEl.textContent = String(ronda);
}

function reproducir(tiposucc) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = tiposucc ? 880 : 220;
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.26);
  } catch {}
}

function limpiarUI() {
  hintArea.innerHTML = '';
  feedback.textContent = '';
  feedback.className = 'feedback';
  nudge.textContent = '';
  answerInput.value = '';
}

function iniciar() {
  terminado = false;
  puntaje = 0;
  ronda = 0;
  orden = mezclar(deportes.map((_, i) => i));
  actualizarMarcadores();
  finalModal.classList.add('hidden');
  startBtn.disabled = true;
  nextBtn.disabled = true;
  hintBtn.disabled = false;
  submitBtn.disabled = false;
  siguienteRonda();
}

function prepararRonda() {
  deporteActual = deportes[orden[ronda - 1]];
  pistaActual = 0;
  intentosFallidos = 0;
  limpiarUI();
  hintBtn.disabled = false;
  submitBtn.disabled = false;
  nextBtn.disabled = true;
  answerInput.focus();
}

function mostrarPista() {
  if (!deporteActual) return;
  if (pistaActual >= 3) return;
  const texto = deporteActual.pistas[pistaActual];
  const div = document.createElement('div');
  div.className = 'hint';
  div.textContent = texto;
  hintArea.appendChild(div);
  pistaActual += 1;
  if (pistaActual >= 3) hintBtn.disabled = true;
}

function puntosPorPistas() {
  if (pistaActual <= 1) return 3;
  if (pistaActual === 2) return 2;
  return 1;
}

function responder() {
  if (!deporteActual) return;
  const ans = normalizar(answerInput.value);
  const correcto = ans === deporteActual.nombre;
  if (correcto) {
    const sum = puntosPorPistas();
    puntaje += sum;
    feedback.textContent = `¡Correcto! Era ${deporteActual.nombre.charAt(0).toUpperCase()}${deporteActual.nombre.slice(1)}`;
    feedback.className = 'feedback ok';
    reproducir(true);
    hintBtn.disabled = true;
    submitBtn.disabled = true;
    nextBtn.disabled = false;
  } else {
    feedback.textContent = 'Incorrecto. Intenta otra vez';
    feedback.className = 'feedback err';
    reproducir(false);
    intentosFallidos += 1;
    if (intentosFallidos >= 3 && pistaActual < 3) {
      nudge.textContent = '¿Quieres otra pista?';
    }
  }
  actualizarMarcadores();
}

function siguienteRonda() {
  if (ronda >= 5) {
    terminarJuego();
    return;
  }
  ronda += 1;
  actualizarMarcadores();
  prepararRonda();
}

function terminarJuego() {
  terminado = true;
  startBtn.disabled = false;
  hintBtn.disabled = true;
  submitBtn.disabled = true;
  nextBtn.disabled = true;
  finalScoreEl.textContent = String(puntaje);
  let frase = '¡Vamos, tú puedes!';
  if (puntaje >= 12) frase = '¡Excelente técnica!';
  else if (puntaje >= 8) frase = '¡Bien hecho!';
  finalPhraseEl.textContent = frase;
  finalModal.classList.remove('hidden');
}

startBtn.addEventListener('click', iniciar);
hintBtn.addEventListener('click', () => { mostrarPista(); });
submitBtn.addEventListener('click', responder);
nextBtn.addEventListener('click', () => {
  siguienteRonda();
});
restartBtn.addEventListener('click', () => { iniciar(); });

welcomeStartBtn.addEventListener('click', () => {
  welcome.classList.add('hidden');
  gameCard.classList.remove('hidden');
  iniciar();
});

answerInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !submitBtn.disabled) responder();
});
