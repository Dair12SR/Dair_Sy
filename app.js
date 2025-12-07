/* ===== CONFIGURACIÓN ===== */
const SECRET_PIN_HASH = "f0e3bd92f157f9b73ede82834286e7cea4044134b39d92ac3ee7e56392194241";
const WAIT_HOURS = 0.01; // solo para pruebas
const MS = 60 * 60 * 1000;

/* ===== FECHAS IMPORTANTES ===== */
const START_DATE = new Date('2018-12-06');
const NEXT_MEETING = new Date('2030-10-23T18:00:00');

/* ===== SUPABASE CONFIG ===== */
const SUPABASE_URL = 'https://xunaogemagmuzkrbtplr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bmFvZ2VtYWdtdXprcmJ0cGxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODU1MTEsImV4cCI6MjA3Njc2MTUxMX0.8WCAchH3pjnqb0E-4RotY-sYagkQptZ1Ty642qIge2Y';
let supabaseClient;

/* ===== FLAGS GLOBALES ===== */
let decoStarted = false;
let modalAutoTimer = null, remainTimer = null;
let notifiedReady = false; // para no repetir la notificación

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

  // Inicializar contador de tiempo
  updateTimeCounter();
  setInterval(updateTimeCounter, 60000);
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

/* ===== FUNCIÓN DESBLOQUEO CON MÚSICA MEJORADA ===== */
async function tryUnlock() {
  const hashedInput = await hashPIN(pin.value);

  if (hashedInput === SECRET_PIN_HASH) {
    // Ocultar pantalla de bloqueo
    document.getElementById("gate").style.display = "none";

    // Mostrar libro
    document.getElementById("bookView").style.display = "block";

    setTimeout(() => {
      document.getElementById("book").classList.add("open");
    }, 100);

    // Pedir permiso para notificaciones (una vez que ya interactuó)
    requestNotificationPermission();

    // Verificar frases
    if (!window.PHRASES || window.PHRASES.length === 0) {
      phraseEl.textContent = "Error: No se pudieron cargar las frases 😔";
      console.error("Las frases no están disponibles");
      return;
    }

    // Mostrar frase
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

    // Iniciar decoraciones
    startDecorations();

    // ===== MÚSICA DE FONDO - VERSIÓN MEJORADA =====
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
      bgMusic.volume = 0.25;
      const hasSources = bgMusic.querySelector('source') !== null || bgMusic.src;

      if (hasSources) {
        console.log('🎵 Intentando reproducir música...');
        const playPromise = bgMusic.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✅ Música reproduciendo automáticamente');
            })
            .catch(error => {
              console.log('⚠️ Autoplay bloqueado por el navegador');
              console.log('💡 La música se reproducirá con cualquier interacción');

              const playOnInteraction = () => {
                bgMusic.play()
                  .then(() => {
                    console.log('✅ Música iniciada después de interacción');
                  })
                  .catch(err => {
                    console.error('❌ Error al reproducir:', err);
                  });
              };

              document.addEventListener('click', playOnInteraction, { once: true });
              document.addEventListener('touchstart', playOnInteraction, { once: true });

              document.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', playOnInteraction, { once: true });
              });
            });
        }
      } else {
        console.warn('⚠️ No se encontró archivo de música en el elemento audio');
      }
    } else {
      console.warn('⚠️ Elemento de audio "background-music" no encontrado');
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
    try {
      ding.currentTime = 0;
      ding.play();
    } catch (e) { }
  }
};

lockBtn.onclick = () => {
  document.getElementById("book").classList.remove("open");
  setTimeout(() => {
    document.getElementById("bookView").style.display = "none";
    document.getElementById("gate").style.display = "flex";
    pin.value = "";

    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
      bgMusic.pause();
      console.log('⏸️ Música pausada');
    }
  }, 400);
};

/* ===== MODAL ===== */
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
  setTimeout(() => {
    modal.style.display = "none";
  }, 180);
  clearTimeout(modalAutoTimer);
  clearInterval(remainTimer);
}

document.getElementById("m-ok").onclick = closeModal;
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

/* ===== RELOJ DE ESPERA Y NOTIFICACIÓN ===== */
function updateRemainingClock() {
  const rem = msRemaining();
  const h = Math.floor(rem / (60 * 60 * 1000));
  const m = Math.floor((rem % (60 * 60 * 1000)) / (60 * 1000));
  const s = Math.floor((rem % (60 * 1000)) / 1000);
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  remainEl.textContent = `${hh}:${mm}:${ss}`;

  if (rem <= 0 && !notifiedReady) {
    notifiedReady = true;
    showTopNotice();
  }

  if (rem > 0 && notifiedReady) {
    notifiedReady = false;
  }
}

/* ===== NOTIFICACIÓN DE NUEVA FRASE ===== */
function requestNotificationPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission().then(() => { });
  }
}

function showTopNotice() {
  const bar = document.getElementById('top-notice');
  const text = document.getElementById('top-notice-text');
  if (!bar || !text) return;

  text.textContent = "Frase nueva para mi esposita hermosa 💕";
  bar.classList.add('show');

  setTimeout(() => bar.classList.remove('show'), 10000);

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Frase nueva para mi esposita hermosa 💕", {
      body: "Ya puedes abrir una nueva frase de amor ✨",
      icon: "https://emojiapi.dev/api/v1/1f49c/128.png"
    });
  }
}

/* ===== FRASES POR DÍA - EMPEZAR DESDE DÍA 51 ===== */
function getDayPhrase() {
  if (!window.PHRASES || window.PHRASES.length === 0) {
    return "No hay frases disponibles 😔";
  }

  const FORCED_DAY = 51;
  const configDate = new Date('2025-12-07');
  const today = new Date();
  const daysSinceConfig = Math.floor((today - configDate) / (1000 * 60 * 60 * 24));
  const currentDay = FORCED_DAY + daysSinceConfig;
  const phraseIndex = (currentDay - 1) % window.PHRASES.length;

  console.log(`📅 Día: ${currentDay} → Frase ${phraseIndex + 1}/${window.PHRASES.length}`);

  const dayLabel = document.querySelector('.phrase-day-label');
  if (dayLabel) {
    dayLabel.textContent = `Día ${currentDay}`;
  }

  return window.PHRASES[phraseIndex];
}

function nextPhraseDifferent() {
  if (!window.PHRASES || window.PHRASES.length === 0) {
    return "No hay frases disponibles 😔";
  }

  const current = localStorage.getItem(K_LAST_TEXT) || "";
  const currentIndex = window.PHRASES.indexOf(current);

  if (currentIndex === -1) {
    return window.PHRASES[50];
  }

  const nextIndex = (currentIndex + 1) % window.PHRASES.length;

  const dayLabel = document.querySelector('.phrase-day-label');
  if (dayLabel) {
    dayLabel.textContent = `Día ${nextIndex + 1}`;
  }

  return window.PHRASES[nextIndex];
}

/* ===== DECORACIONES ===== */
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
    b.animate([{ transform: "translateY(0)" }, { transform: "translateY(-250px)" }], {
      duration: 10000,
      iterations: Infinity,
      easing: "ease-in-out"
    });
    setTimeout(() => b.remove(), 15000);
  }, 6000);
}

/* ===== CONTADORES ===== */
function updateDayCounter() {
  const today = new Date();
  const diffTime = Math.abs(today - START_DATE);
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const shownDays = Math.max(days, 15);

  const counter = document.getElementById('days-together');
  if (counter) {
    counter.textContent = shownDays;
  }

  const phraseDayEl = document.querySelector('.phrase-day');
  if (phraseDayEl && window.PHRASES) {
    const OFFSET = 50;
    const phraseDay = ((shownDays - 1 + OFFSET) % window.PHRASES.length) + 1;
    phraseDayEl.textContent = `Frase del día ${phraseDay}`;
  }
}

function updateTimeCounter() {
  updateDayCounter();

  const now = new Date();
  const targetDate = new Date(NEXT_MEETING);
  const diffMs = targetDate - now;

  if (diffMs <= 0) {
    const yearsEl = document.getElementById('years-together');
    const monthsEl = document.getElementById('months-extra');
    const daysEl = document.getElementById('days-extra');

    if (yearsEl) yearsEl.textContent = '0';
    if (monthsEl) monthsEl.textContent = '0';
    if (daysEl) daysEl.textContent = '0';
    return;
  }

  let years = targetDate.getFullYear() - now.getFullYear();
  let months = targetDate.getMonth() - now.getMonth();
  let days = targetDate.getDate() - now.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const yearsEl = document.getElementById('years-together');
  const monthsEl = document.getElementById('months-extra');
  const daysEl = document.getElementById('days-extra');

  if (yearsEl) yearsEl.textContent = years;
  if (monthsEl) monthsEl.textContent = months;
  if (daysEl) daysEl.textContent = days;
}

setInterval(updateTimeCounter, 60000);
setInterval(updateDayCounter, 60000);

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
    .map(([emoji, count]) => `${emoji} ${count}`)
    .join(' ');
}

/* ===== GALERÍA ===== */
const PHOTOS = [
  { url: 'juntitos.jpeg', caption: 'Nuestro primer día hablando', date: '2019-01-09' },
  { url: 'noche.jpeg', caption: 'La noche del Matrimonio', date: '2021-09-25' },
  { url: 'juntitos.jpeg', caption: 'Nuestro lugar favorito', date: 'cuando podiamos vernos' },
  { url: 'juntos.jpeg', caption: 'Día especial', date: '25' }
];

async function openGallery() {
  const modal = document.getElementById('gallery-modal');
  const grid = document.getElementById('gallery-grid');
  modal.style.display = 'flex';
  grid.innerHTML = '<p style="text-align: center; color: #ff6bd9; padding: 40px;">Cargando fotos... 📸</p>';

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
      }
    } catch (error) {
      console.error('❌ Error al cargar fotos:', error);
    }
  }

  const allPhotos = [...localPhotos, ...uploadedPhotos];
  grid.innerHTML = '';

  if (allPhotos.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No hay fotos aún. ¡Sube la primera! 📸</p>';
    return;
  }

  allPhotos.forEach((photo, index) => {
    setTimeout(() => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      card.style.animationDelay = `${index * 0.1}s`;
      card.innerHTML = `
        <img src="${photo.url}" alt="${photo.caption}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size=%2290%22%3E📷%3C/text%3E%3C/svg%3E'">
        <div class="photo-info">
          <h4>${photo.caption}</h4>
          <p>${photo.date}</p>
        </div>
      `;
      grid.appendChild(card);
    }, index * 50);
  });
}

function closeGallery() {
  document.getElementById('gallery-modal').style.display = 'none';
}

/* ===== HISTORIAL ===== */
function saveToHistory(phrase) {
  const history = JSON.parse(localStorage.getItem('lovebook:history') || '[]');
  history.unshift({
    text: phrase,
    date: new Date().toISOString()
  });
  if (history.length > 50) history.pop();
  localStorage.setItem('lovebook:history', JSON.stringify(history));
}

function openHistory() {
  const modal = document.getElementById('history-modal');
  const list = document.getElementById('history-list');
  modal.style.display = 'flex';

  const history = JSON.parse(localStorage.getItem('lovebook:history') || '[]');
  if (history.length === 0) {
    list.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No hay historial aún 📖</p>';
    return;
  }

  list.innerHTML = history.map((item, index) => `
    <div class="history-item" style="animation-delay: ${index * 0.05}s">
      <div class="phrase-text">${item.text}</div>
      <div class="phrase-date">${new Date(item.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}</div>
    </div>
  `).join('');
}

function closeHistory() {
  document.getElementById('history-modal').style.display = 'none';
}

/* ===== SUBIR FOTO ===== */
function openUploadModal() {
  const modal = document.getElementById('upload-modal');
  if (modal) {
    modal.classList.add('active');
    const dateInput = document.getElementById('photo-date');
    if (dateInput) {
      dateInput.valueAsDate = new Date();
    }
  }
}

function closeUploadModal() {
  const modal = document.getElementById('upload-modal');
  if (modal) {
    modal.classList.remove('active');
    const fileInput = document.getElementById('photo-file');
    const captionInput = document.getElementById('photo-caption');
    const preview = document.getElementById('upload-preview');
    const progress = document.getElementById('upload-progress');

    if (fileInput) fileInput.value = '';
    if (captionInput) captionInput.value = '';
    if (preview) preview.innerHTML = '';
    if (progress) progress.classList.remove('active');
  }
}

async function uploadPhoto() {
  const fileInput = document.getElementById('photo-file');
  const caption = document.getElementById('photo-caption').value;
  const date = document.getElementById('photo-date').value;

  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    alert('Por favor selecciona una foto 📷');
    return;
  }

  const file = fileInput.files[0];

  if (!file.type.startsWith('image/')) {
    alert('Por favor selecciona solo imágenes 🖼️');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('La imagen es muy grande. Máximo 5MB 📏');
    return;
  }

  const progress = document.getElementById('upload-progress');
  const progressFill = document.getElementById('upload-progress-fill');
  const statusText = document.getElementById('upload-status');

  if (progress) progress.classList.add('active');
  if (statusText) statusText.textContent = 'Subiendo...';
  if (progressFill) progressFill.style.width = '30%';

  try {
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `foto_${timestamp}.${fileExtension}`;

    if (progressFill) progressFill.style.width = '50%';

    const { data, error } = await supabaseClient.storage
      .from('Fotos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    if (progressFill) progressFill.style.width = '70%';

    const { data: urlData } = supabaseClient.storage
      .from('Fotos')
      .getPublicUrl(fileName);

    if (progressFill) progressFill.style.width = '85%';

    const { error: dbError } = await supabaseClient
      .from('fotos_metadata')
      .insert([{
        filename: fileName,
        caption: caption || 'Sin descripción',
        date: date || new Date().toISOString().split('T')[0],
        url: urlData.publicUrl
      }]);

    if (dbError) throw dbError;

    if (progressFill) progressFill.style.width = '100%';
    if (statusText) statusText.textContent = '✅ Foto subida exitosamente';

    setTimeout(() => {
      closeUploadModal();
      openGallery();
    }, 1500);

  } catch (error) {
    console.error('❌ Error:', error);
    if (statusText) statusText.textContent = '❌ Error: ' + error.message;
    if (progressFill) progressFill.style.width = '0%';
  }
}

// Preview de imagen
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('photo-file');
  if (fileInput) {
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = document.getElementById('upload-preview');
          if (preview) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 10px;">`;
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
});


