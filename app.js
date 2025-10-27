/* ===== CONFIGURACIÓN ===== */

const SECRET_PIN_HASH = "f0e3bd92f157f9b73ede82834286e7cea4044134b39d92ac3ee7e56392194241";
const WAIT_HOURS = 12;
const MS = 60 * 60 * 1000;

/* ===== FECHAS IMPORTANTES ===== */

const START_DATE = new Date('2018-12-06');
const NEXT_MEETING = new Date('2030-10-23T18:00:00');

/* ===== SUPABASE CONFIG ===== */

const SUPABASE_URL = 'https://xunaogemagmuzkrbtplr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bmFvZ2VtYWdtdXprcmJ0cGxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODU1MTEsImV4cCI6MjA3Njc2MTUxMX0.8WCAchH3pjnqb0E-4RotY-sYagkQptZ1Ty642qIge2Y';

let supabaseClient;

/* ===== VERIFICACIÓN DE CARGA ===== */

window.addEventListener('DOMContentLoaded', () => {
  console.log("🔍 Verificando carga de frases...");
  if (!window.PHRASES || window.PHRASES.length === 0) {
    console.error("❌ ERROR: Las frases no se cargaron");
    alert("Error: No se pudieron cargar las frases. Verifica que frases_silvia.js esté en la misma carpeta.");
  } else {
    console.log("✅ Frases cargadas:", window.PHRASES.length);
  }
  
  if (!window.DEDICATION) {
    console.error("❌ ERROR: La dedicatoria no se cargó");
  } else {
    console.log("✅ Dedicatoria cargada");
  }
  
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase inicializado');
  }
});

/* ===== FUNCIÓN HASH SHA-256 ===== */

async function hashPIN(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ===== CLAVES DE LOCALSTORAGE ===== */

const K_LAST_TIME = "lovebook:lastPhraseAt";
const K_LAST_TEXT = "lovebook:lastPhraseText";
const K_FIRST_OPEN = "lovebook:firstOpen";

/* ===== ELEMENTOS ===== */

const pin = document.getElementById("pin");
const toast = document.getElementById("toast");
const ding = document.getElementById("ding");
const phraseEl = document.getElementById("phrase");
const moreBtn = document.getElementById("more");
const lockBtn = document.getElementById("lock");
const modal = document.getElementById("modal");
const modalBox = document.getElementById("modalBox");
const remainEl = document.getElementById("remain");

/* ===== TECLADO PIN ===== */

document.querySelectorAll("[data-k]").forEach(b => b.onclick = () => {
  if (pin.value.length < 4) pin.value += b.dataset.k;
});

document.getElementById("clear").onclick = () => {
  pin.value = "";
  toast.textContent = "PIN borrado";
};

document.getElementById("enter").onclick = async () => await tryUnlock();

/* ===== FUNCIÓN DESBLOQUEO CON MÚSICA AUTOMÁTICA ===== */

async function tryUnlock() {
  const hashedInput = await hashPIN(pin.value);
  if (hashedInput === SECRET_PIN_HASH) {
    document.getElementById("gate").style.display = "none";
    document.getElementById("bookView").style.display = "";
    setTimeout(() => document.getElementById("book").classList.add("open"), 100);
    
    const uploadBtn = document.getElementById('upload-photo-btn');
    if (uploadBtn) {
      uploadBtn.style.display = 'inline-block';
    }
    
    if (!window.PHRASES || window.PHRASES.length === 0) {
      phraseEl.textContent = "Error: No se pudieron cargar las frases 😔";
      console.error("Las frases no están disponibles");
      return;
    }
    
    if (!localStorage.getItem(K_FIRST_OPEN) && window.DEDICATION) {
      showTyped(window.DEDICATION);
      localStorage.setItem(K_FIRST_OPEN, "true");
      markNow();
    } else {
      const savedText = localStorage.getItem(K_LAST_TEXT);
      if (savedText) {
        phraseEl.textContent = savedText;
        showReactions();
      } else {
        const first = getDayPhrase();
        showTyped(first);
        markNow();
      }
    }
    
    startDecorations();
    
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
      bgMusic.volume = 0.25;
      bgMusic.play().then(() => {
        console.log('✅ Música reproduciendo');
      }).catch(err => {
        console.log('⚠️ Música bloqueada. Requiere interacción.');
        document.body.addEventListener('click', function playOnce() {
          bgMusic.play().catch(() => {});
          document.body.removeEventListener('click', playOnce);
        }, { once: true });
      });
    }
  } else {
    toast.textContent = "PIN incorrecto 💔";
    pin.classList.remove("shake");
    void pin.offsetWidth;
    pin.classList.add("shake");
    pin.value = "";
  }
}

/* ===== GESTIÓN DE TIEMPO ===== */

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

function showTyped(text) {
  phraseEl.textContent = "";
  let i = 0;
  const t = setInterval(() => {
    phraseEl.textContent = text.slice(0, ++i);
    phraseEl.classList.add("type");
    if (i >= text.length) {
      clearInterval(t);
      setTimeout(() => {
        phraseEl.classList.remove("type");
        showReactions();
      }, 300);
    }
  }, 22);
  localStorage.setItem(K_LAST_TEXT, text);
  saveToHistory(text);
}

/* ===== BOTONES LIBRO ===== */

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
    
    const uploadBtn = document.getElementById('upload-photo-btn');
    if (uploadBtn) {
      uploadBtn.style.display = 'none';
    }
    
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
      bgMusic.pause();
    }
  }, 400);
};

/* ===== MODAL ===== */

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

/* ===== FRASES POR DÍA ===== */

function getDayPhrase() {
  if (!window.PHRASES || window.PHRASES.length === 0) {
    return "No hay frases disponibles 😔";
  }
  
  const today = new Date();
  const diffTime = Math.abs(today - START_DATE);
  const daysTogether = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const phraseIndex = (daysTogether - 1) % window.PHRASES.length;
  return window.PHRASES[phraseIndex];
}

function randomPhrase() {
  return getDayPhrase();
}

function nextPhraseDifferent() {
  if (!window.PHRASES || window.PHRASES.length === 0) {
    return "No hay frases disponibles 😔";
  }
  
  const current = localStorage.getItem(K_LAST_TEXT) || "";
  const currentIndex = window.PHRASES.indexOf(current);
  if (currentIndex === -1 || currentIndex >= window.PHRASES.length - 1) {
    return window.PHRASES[0];
  }
  
  return window.PHRASES[currentIndex + 1];
}

/* ===== DECORACIONES ===== */

let decoStarted = false;

function startDecorations() {
  if (decoStarted) return;
  decoStarted = true;
  
  setInterval(() => {
    const h = document.createElement("div");
    h.className = "heart";
    h.textContent = "💕";
    h.style.left = Math.random() * 100 + "%";
    h.style.animationDuration = (5 + Math.random() * 4) + "s";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 9000);
  }, 400);
  
  setInterval(() => {
    const b = document.createElement("div");
    b.className = "bear";
    b.textContent = "🧸";
    b.style.left = Math.random() * 90 + "%";
    b.style.top = "80%";
    document.body.appendChild(b);
    b.animate([{ transform: "translateY(0)" }, { transform: "translateY(-250px)" }],
      { duration: 10000, iterations: Infinity, easing: "ease-in-out" });
    setTimeout(() => b.remove(), 15000);
  }, 6000);
}

// ===== CONTADOR DE DÍAS =====
function updateDayCounter() {
    const today = new Date();
    const diffTime = Math.abs(today - START_DATE);
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Mínimo inicia en 15
    const shownDays = Math.max(days, 15);

    const counter = document.getElementById('days-together');
    if (counter) {
        counter.textContent = shownDays;
    }

    const phraseDayEl = document.querySelector('.phrase-day');
    if (phraseDayEl) {
        const phraseDay = (shownDays - 1) % window.PHRASES.length + 1;
        phraseDayEl.textContent = `Frase del día ${phraseDay}`;
    }
}

setInterval(updateDayCounter, 60000);
updateDayCounter();

/* ===== REACCIONES ===== */

function addReaction(emoji) {
  const reactions = JSON.parse(localStorage.getItem('lovebook:reactions') || '{}');
  const currentPhrase = localStorage.getItem(K_LAST_TEXT);
  if (!currentPhrase) return;
  
  if (!reactions[currentPhrase]) {
    reactions[currentPhrase] = [];
  }
  
  reactions[currentPhrase].push({
    emoji: emoji,
    date: new Date().toISOString()
  });
  
  localStorage.setItem('lovebook:reactions', JSON.stringify(reactions));
  showReactions();
  
  const btn = event.target;
  btn.style.transform = 'scale(1.5)';
  setTimeout(() => btn.style.transform = 'scale(1)', 300);
}

function showReactions() {
  const reactions = JSON.parse(localStorage.getItem('lovebook:reactions') || '{}');
  const currentPhrase = localStorage.getItem(K_LAST_TEXT);
  const display = document.getElementById('reaction-display');
  
  if (!display || !currentPhrase) return;
  
  const phraseReactions = reactions[currentPhrase] || [];
  
  if (phraseReactions.length === 0) {
    display.innerHTML = '';
    return;
  }
  
  const emojiCount = {};
  phraseReactions.forEach(r => {
    emojiCount[r.emoji] = (emojiCount[r.emoji] || 0) + 1;
  });
  
  display.innerHTML = Object.entries(emojiCount)
    .map(([emoji, count]) => `<span class="reaction-count">${emoji} ${count}</span>`)
    .join(' ');
}

/* ===== GALERÍA - CARGA DESDE SUPABASE ===== */

const PHOTOS = [
  { url: 'primerdia.jpeg', caption: 'Nuestro primer día hablando', date: '2019-01-09' },
  { url: 'noche.jpeg', caption: 'La noche del Matrimonio', date: '2021-09-25' },
  { url: 'juntitos.jpeg', caption: 'Nuestro lugar favorito', date: 'cuando podiamos vernos' },
  { url: 'juntos.jpeg', caption: 'Día especial', date: '25' }
];

async function openGallery() {
  const modal = document.getElementById('gallery-modal');
  const grid = document.getElementById('gallery-grid');
  
  modal.style.display = 'flex';
  grid.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">Cargando fotos... 📸</p>';
  
  const localPhotos = PHOTOS || [];
  let uploadedPhotos = [];
  
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('fotos_metadata')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        uploadedPhotos = data.map(item => ({
          url: item.url,
          caption: item.caption || 'Sin descripción',
          date: item.date || 'Sin fecha'
        }));
        
        console.log('✅ Fotos cargadas desde Supabase:', uploadedPhotos.length);
      }
    } catch (error) {
      console.error('❌ Error al cargar fotos:', error);
    }
  }
  
  const allPhotos = [...localPhotos, ...uploadedPhotos];
  
  grid.innerHTML = '';
  
  if (allPhotos.length === 0) {
    grid.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1; font-size: 18px;">No hay fotos aún. ¡Sube la primera! 📸</p>';
    return;
  }
  
  allPhotos.forEach((photo, index) => {
    setTimeout(() => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      card.style.animationDelay = `${index * 0.1}s`;
      
      card.innerHTML = `
        <img src="${photo.url}" alt="${photo.caption}" class="photo-img">
        <div class="photo-info">
          <div class="photo-caption">${photo.caption}</div>
          <div class="photo-date">${photo.date}</div>
        </div>
      `;
      
      grid.appendChild(card);
    }, index * 100);
  });
}

function closeGallery() {
  document.getElementById('gallery-modal').style.display = 'none';
}

/* ===== COUNTDOWN - CUENTA REGRESIVA EXACTA ===== */

function updateCountdown() {
  const now = new Date();
  const diff = NEXT_MEETING - now;
  
  if (diff <= 0) {
    document.getElementById('count-years').textContent = '0';
    document.getElementById('count-months').textContent = '0';
    document.getElementById('count-days').textContent = '0';
    return;
  }
  
  let years = NEXT_MEETING.getFullYear() - now.getFullYear();
  let months = NEXT_MEETING.getMonth() - now.getMonth();
  let days = NEXT_MEETING.getDate() - now.getDate();
  
  if (days < 0) {
    months--;
    const lastMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    days += lastMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  if (years === 0 && months === 0 && days === 0 && now.getTime() > NEXT_MEETING.getTime()) {
    years = 0;
    months = 0;
    days = 0;
  }
  
  const yearsEl = document.getElementById('count-years');
  const monthsEl = document.getElementById('count-months');
  const daysEl = document.getElementById('count-days');
  
  if (yearsEl) yearsEl.textContent = years;
  if (monthsEl) monthsEl.textContent = months;
  if (daysEl) daysEl.textContent = days;
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* ===== TEMAS ===== */

const THEMES = {
  default: { name: 'Rosa', icon: '🌸', bg1: '#ffd1dc', bg2: '#ffb6c1', bg3: '#ffc0cb' },
  romantic: { name: 'Romántico', icon: '💕', bg1: '#ff6bd9', bg2: '#f093fb', bg3: '#ff8fab' },
  pastel: { name: 'Pastel', icon: '🎀', bg1: '#ffecd2', bg2: '#fcb69f', bg3: '#ffdde1' },
  lavender: { name: 'Lavanda', icon: '💜', bg1: '#c8a2c8', bg2: '#e6e6fa', bg3: '#d8bfd8' },
  sunset: { name: 'Atardecer', icon: '🌅', bg1: '#ff9a9e', bg2: '#fecfef', bg3: '#ffdde1' }
};

function toggleTheme() {
  const themeKeys = Object.keys(THEMES);
  let current = localStorage.getItem('lovebook:theme') || 'default';
  let index = themeKeys.indexOf(current);
  index = (index + 1) % themeKeys.length;
  const newTheme = themeKeys[index];
  applyTheme(newTheme);
  localStorage.setItem('lovebook:theme', newTheme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = THEMES[newTheme].icon;
}

function applyTheme(themeName) {
  const theme = THEMES[themeName];
  document.body.style.background = `linear-gradient(135deg, ${theme.bg1} 0%, ${theme.bg2} 50%, ${theme.bg3} 100%)`;
  document.body.style.backgroundSize = '400% 400%';
}

const savedTheme = localStorage.getItem('lovebook:theme') || 'default';
applyTheme(savedTheme);
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) themeBtn.textContent = THEMES[savedTheme].icon;

/* ===== HISTORIAL ===== */

function saveToHistory(phrase) {
  const history = JSON.parse(localStorage.getItem('lovebook:history') || '[]');
  history.unshift({
    phrase: phrase,
    date: new Date().toISOString(),
    dateFormatted: new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  });
  if (history.length > 50) history.pop();
  localStorage.setItem('lovebook:history', JSON.stringify(history));
}

function openHistory() {
  const modal = document.getElementById('history-modal');
  const list = document.getElementById('history-list');
  const history = JSON.parse(localStorage.getItem('lovebook:history') || '[]');
  
  modal.style.display = 'flex';
  
  if (history.length === 0) {
    list.innerHTML = '<p style="color: white; text-align: center; font-size: 18px;">No hay historial aún 📖</p>';
    return;
  }
  
  list.innerHTML = history.map((item, index) => `
    <div class="history-item" style="animation-delay: ${index * 0.1}s">
      <div class="history-date">${item.dateFormatted}</div>
      <div class="history-phrase">${item.phrase}</div>
    </div>
  `).join('');
}

function closeHistory() {
  document.getElementById('history-modal').style.display = 'none';
}

