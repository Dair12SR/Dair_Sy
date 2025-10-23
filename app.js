/* ===== CONFIGURACIÓN ===== */
const SECRET_PIN_HASH = "f0e3bd92f157f9b73ede82834286e7cea4044134b39d92ac3ee7e56392194241";
const WAIT_HOURS = 12;
const MS = 60 * 60 * 1000;

/* ===== FECHAS IMPORTANTES ===== */
const START_DATE = new Date('2018-12-06'); // 6 de diciembre 2018
const NEXT_MEETING = new Date('2025-11-01T18:00:00'); // Próximo encuentro

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
        
        // 🎵 REPRODUCIR MÚSICA AUTOMÁTICAMENTE
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

/* ===== CONTADOR DE DÍAS ===== */
function updateDayCounter() {
    const today = new Date();
    const diffTime = Math.abs(today - START_DATE);
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const counter = document.getElementById('days-together');
    if (counter) {
        const phraseDay = ((days - 1) % window.PHRASES.length) + 1;
        counter.innerHTML = `
            <span class="days-num">${days}</span> 
            <span class="days-text">días juntos 💕</span>
            <br>
            <small style="font-size: 13px; color: #8b5a8d; margin-top: 8px; display: block;">Frase del día ${phraseDay}</small>
        `;
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

/* ===== GALERÍA ===== */
const PHOTOS = [
    {
        url: 'primerdia.jpeg',
        caption: 'Nuestro primer día hablando',
        date: '2019-01-09'
    },
    {
        url: 'noche.jpeg',
        caption: 'La noche del Matrimonio',
        date: '2021-09-25'
    },
    {
        url: 'juntitos.jpeg',
        caption: 'Nuestro lugar favorito',
        date: 'cuando podiamos vernos'
    },
    {
        url: 'juntos.jpeg',
        caption: 'Día especial',
        date: '25'
    }
];

function openGallery() {
    const modal = document.getElementById('gallery-modal');
    const grid = document.getElementById('gallery-grid');
    
    modal.style.display = 'flex';
    
    grid.innerHTML = PHOTOS.map((photo, index) => `
        <div class="photo-card" style="animation-delay: ${index * 0.1}s">
            <img src="${photo.url}" alt="${photo.caption}" class="photo-img">
            <div class="photo-info">
                <p class="photo-caption">${photo.caption}</p>
                <p class="photo-date">${photo.date}</p>
            </div>
        </div>
    `).join('');
}

function closeGallery() {
    document.getElementById('gallery-modal').style.display = 'none';
}

/* ===== CRONÓMETRO REGRESIVO DE 5 AÑOS ===== */
function updateCountdown() {
    // Fecha objetivo: 5 años desde hoy (23 oct 2025)
    const targetDate = new Date('2030-10-23T00:00:00');
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
        document.getElementById('countdown').innerHTML = 
            '<p style="color: #8b5a8d; font-size: 24px; font-weight: 800; text-align: center;">¡Llegó el día! 💕✨🎉</p>';
        return;
    }
    
    // Calcular años, meses y días restantes
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365);
    const remainingDaysAfterYears = totalDays % 365;
    const months = Math.floor(remainingDaysAfterYears / 30);
    const days = remainingDaysAfterYears % 30;
    
    const yearsEl = document.getElementById('count-years');
    const monthsEl = document.getElementById('count-months');
    const daysEl = document.getElementById('count-days');
    
    if (yearsEl) yearsEl.textContent = years;
    if (monthsEl) monthsEl.textContent = months;
    if (daysEl) daysEl.textContent = days;
}

setInterval(updateCountdown, 1000); // Actualizar cada segundo
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
        list.innerHTML = '<p style="text-align:center; color:white; font-size:18px;">No hay historial aún 📖</p>';
        return;
    }
    
    list.innerHTML = history.map((item, index) => `
        <div class="history-item" style="animation-delay: ${index * 0.05}s">
            <div class="history-date">${item.dateFormatted}</div>
            <div class="history-phrase">${item.phrase}</div>
        </div>
    `).join('');
}

function closeHistory() {
    document.getElementById('history-modal').style.display = 'none';
}
