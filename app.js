/* ===== CONFIGURACIÓN ===== */
const SECRET_PIN = "200429";
const WAIT_HOURS = 12;
const MS = 60 * 60 * 1000;

/* ===== CLAVES DE LOCALSTORAGE ===== */
const K_LAST_TIME = "lovebook:lastPhraseAt";
const K_LAST_TEXT = "lovebook:lastPhraseText";
const K_FIRST_OPEN = "lovebook:firstOpen";

/* ===== ELEMENTOS ===== */
const pin = document.getElementById("pin");
const toast = document.getElementById("toast");
const music = document.getElementById("music");
const ding = document.getElementById("ding");
const phraseEl = document.getElementById("phrase");
const moreBtn = document.getElementById("more");
const lockBtn = document.getElementById("lock");
const modal = document.getElementById("modal");
const modalBox = document.getElementById("modalBox");
const remainEl = document.getElementById("remain");

/* ===== TECLADO PIN ===== */
document.querySelectorAll("[data-k]").forEach(b => b.onclick = () => {
  if (pin.value.length < 6) pin.value += b.dataset.k;
});
document.getElementById("clear").onclick = () => {
  pin.value = "";
  toast.textContent = "PIN borrado";
};
document.getElementById("enter").onclick = tryUnlock;

/* ===== FUNCIÓN DESBLOQUEO ===== */
function tryUnlock() {
  if (pin.value === SECRET_PIN) {
    document.getElementById("gate").style.display = "none";
    document.getElementById("bookView").style.display = "";
    setTimeout(() => document.getElementById("book").classList.add("open"), 100);

    // Si es la primera vez, mostrar dedicatoria
    if (!localStorage.getItem(K_FIRST_OPEN) && window.DEDICATION) {
      showTyped(window.DEDICATION);
      localStorage.setItem(K_FIRST_OPEN, "true");
      markNow();
    } else {
      const savedText = localStorage.getItem(K_LAST_TEXT);
      if (savedText) {
        phraseEl.textContent = savedText;
      } else {
        const first = randomPhrase();
        showTyped(first);
        markNow();
      }
    }

    startDecorations();
    music.volume = 0.35;
    music.play().catch(() => {});
  } else {
    toast.textContent = "PIN incorrecto 💔";
    pin.classList.remove("shake");
    void pin.offsetWidth;
    pin.classList.add("shake");
    pin.value = "";
  }
}

/* ===== SISTEMA DE ESPERA (12 HORAS) ===== */
function canOpenNew() {
  const last = Number(localStorage.getItem(K_LAST_TIME) || 0);
  const now = Date.now();
  return (now - last) >= WAIT_HOURS * MS;
}
function msRemaining() {
  const last = Number(localStorage.getItem(K_LAST_TIME) || 0);
  const now = Date.now();
  const remaining = WAIT_HOURS * MS - (now - last);
  return Math.max(0, remaining);
}
function markNow() {
  localStorage.setItem(K_LAST_TIME, String(Date.now()));
}

/* ===== MOSTRAR FRASE ===== */
function showTyped(text) {
  phraseEl.textContent = "";
  let i = 0;
  const t = setInterval(() => {
    phraseEl.textContent = text.slice(0, ++i);
    phraseEl.classList.add("type");
    if (i >= text.length) {
      clearInterval(t);
      setTimeout(() => phraseEl.classList.remove("type"), 300);
    }
  }, 22);
  localStorage.setItem(K_LAST_TEXT, text);
}

/* ===== BOTONES ===== */
moreBtn.onclick = () => {
  if (canOpenNew()) {
    const next = nextPhraseDifferent();
    showTyped(next);
    markNow();
  } else {
    updateRemainingClock();
    openModal();
    try { ding.currentTime = 0; ding.play(); } catch (e) {}
  }
};

lockBtn.onclick = () => {
  document.getElementById("book").classList.remove("open");
  setTimeout(() => {
    document.getElementById("bookView").style.display = "none";
    document.getElementById("gate").style.display = "";
    pin.value = "";
    music.pause();
  }, 400);
};

/* ===== MODAL (alerta elegante) ===== */
let modalAutoTimer = null, remainTimer = null;
function openModal() {
  modal.style.display = "flex";
  requestAnimationFrame(() => modalBox.classList.add("show"));
  clearTimeout(modalAutoTimer);
  modalAutoTimer = setTimeout(closeModal, 5000);
  clearInterval(remainTimer);
  remainTimer = setInterval(updateRemainingClock, 1000);
}
function closeModal() {
  modalBox.classList.remove("show");
  setTimeout(() => { modal.style.display = "none"; }, 180);
  clearTimeout(modalAutoTimer);
  clearInterval(remainTimer);
}
document.getElementById("m-ok").onclick = closeModal;
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

function updateRemainingClock() {
  const rem = msRemaining();
  const h = Math.floor(rem / (60 * 60 * 1000));
  const m = Math.floor((rem % (60 * 60 * 1000)) / (60 * 1000));
  const s = Math.floor((rem % (60 * 1000)) / 1000);
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  remainEl.textContent = `${hh}:${mm}:${ss}`;
}

/* ===== FRASES ===== */
function randomPhrase() {
  return window.PHRASES[Math.floor(Math.random() * window.PHRASES.length)];
}
function nextPhraseDifferent() {
  const current = localStorage.getItem(K_LAST_TEXT) || "";
  let t;
  if (window.PHRASES.length <= 1) return randomPhrase();
  do { t = randomPhrase(); } while (t === current);
  return t;
}

/* ===== DECORACIONES ===== */
let decoStarted = false;
function startDecorations() {
  if (decoStarted) return;
  decoStarted = true;
  setInterval(() => {
    const h = document.createElement("div");
    h.className = "heart";
    h.style.left = Math.random() * 100 + "%";
    h.style.animationDuration = (5 + Math.random() * 4) + "s";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 9000);
  }, 400);

  setInterval(() => {
    const b = document.createElement("div");
    b.className = "bear"; b.textContent = "🧸";
    b.style.left = Math.random() * 90 + "%"; b.style.top = "80%";
    document.body.appendChild(b);
    b.animate([{ transform: "translateY(0)" }, { transform: "translateY(-250px)" }],
              { duration: 10000, iterations: Infinity, easing: "ease-in-out" });
    setTimeout(() => b.remove(), 15000);
  }, 6000);
}
