/* ============================================================
   PASTEL DIARY — script.js
   Features: LocalStorage, Claude AI, Canvas Mood Graph
   ============================================================ */

// ─── State ──────────────────────────────────────────────────
const DB_KEY      = 'pastel_diary_entries';
const CONFIG_KEY  = 'pastel_diary_config';

let entries       = [];   // [{id, title, body, mood, date, aiResponse}]
let currentId     = null; // entry being edited
let selectedMood  = 0;
let config        = { diaryName: 'My Diary', apiKey: '' };

// ─── DOM refs ────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const setupScreen     = $('setupScreen');
const appEl           = $('app');
const diaryNameInput  = $('diaryNameInput');
const apiKeyInput     = $('apiKeyInput');
const setupBtn        = $('setupBtn');
const diaryNameDisplay= $('diaryNameDisplay');
const dateDisplay     = $('dateDisplay');
const dateEditBtn     = $('dateEditBtn');
const dateInput       = $('dateInput');
const moodPicks       = $('moodPicks');
const entryTitle      = $('entryTitle');
const entryBody       = $('entryBody');
const charCount       = $('charCount');
const saveBtn         = $('saveBtn');
const askAiBtn        = $('askAiBtn');
const aiPanel         = $('aiPanel');
const aiLoading       = $('aiLoading');
const aiText          = $('aiText');
const aiClose         = $('aiClose');
const entryList       = $('entryList');
const newEntryBtn     = $('newEntryBtn');
const exportBtn       = $('exportBtn');
const settingsBtn     = $('settingsBtn');
const settingsModal   = $('settingsModal');
const settingsDiaryName = $('settingsDiaryName');
const settingsApiKey  = $('settingsApiKey');
const settingsCancel  = $('settingsCancel');
const settingsSave    = $('settingsSave');
const toast           = $('toast');
const sidebarToggle   = $('sidebarToggle');
const sidebar         = document.querySelector('.sidebar');

// ─── Init ─────────────────────────────────────────────────────
function init() {
  loadConfig();
  loadEntries();

  if (config.diaryName && config.apiKey) {
    setupScreen.style.display = 'none';
    appEl.style.display = 'grid';
    showApp();
  } else {
    setupScreen.style.display = 'flex';
    appEl.style.display = 'none';
  }
}

// ─── Config ───────────────────────────────────────────────────
function loadConfig() {
  const raw = localStorage.getItem(CONFIG_KEY);
  if (raw) config = JSON.parse(raw);
}

function saveConfig() {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

// ─── Entries ──────────────────────────────────────────────────
function loadEntries() {
  const raw = localStorage.getItem(DB_KEY);
  entries = raw ? JSON.parse(raw) : [];
}

function saveEntries() {
  localStorage.setItem(DB_KEY, JSON.stringify(entries));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ─── Setup screen ─────────────────────────────────────────────
setupBtn.addEventListener('click', () => {
  const name = diaryNameInput.value.trim();
  const key  = apiKeyInput.value.trim();
  if (!name) { showToast('Please give your diary a name 🌸'); return; }
  if (!key)  { showToast('Please enter your API key ✨'); return; }

  config.diaryName = name;
  config.apiKey    = key;
  saveConfig();
  setupScreen.style.display = 'none';
  appEl.style.display = 'grid';
  showApp();
});

diaryNameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') apiKeyInput.focus();
});
apiKeyInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') setupBtn.click();
});

// ─── Show App ─────────────────────────────────────────────────
function showApp() {
  appEl.style.display = 'grid';
  diaryNameDisplay.textContent = config.diaryName;
  document.title = config.diaryName;
  setTodayDate();
  renderEntryList();
  drawMoodGraph();
  newEntry();
}

// ─── Date ─────────────────────────────────────────────────────
function setTodayDate() {
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
  updateDateDisplay(today);
}

function updateDateDisplay(val) {
  const d = new Date(val + 'T00:00:00');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateDisplay.textContent = d.toLocaleDateString('en-US', options);
}

dateEditBtn.addEventListener('click', () => {
  const isHidden = dateInput.style.display === 'none';
  dateInput.style.display = isHidden ? 'inline-block' : 'none';
  if (isHidden) dateInput.focus();
});

dateInput.addEventListener('change', () => {
  updateDateDisplay(dateInput.value);
  dateInput.style.display = 'none';
});

// ─── Mood picker ──────────────────────────────────────────────
moodPicks.addEventListener('click', e => {
  const btn = e.target.closest('.mood-btn');
  if (!btn) return;
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedMood = parseInt(btn.dataset.mood);
});

function setMood(val) {
  selectedMood = val;
  document.querySelectorAll('.mood-btn').forEach(b => {
    b.classList.toggle('selected', parseInt(b.dataset.mood) === val);
  });
}

// ─── Word count ───────────────────────────────────────────────
entryBody.addEventListener('input', () => {
  const words = entryBody.value.trim().split(/\s+/).filter(Boolean).length;
  charCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
});

// ─── New Entry ────────────────────────────────────────────────
function newEntry() {
  currentId = null;
  entryTitle.value = '';
  entryBody.value  = '';
  charCount.textContent = '0 words';
  setTodayDate();
  setMood(0);
  aiPanel.style.display = 'none';
  document.querySelectorAll('.entry-item').forEach(el => el.classList.remove('active'));
  entryTitle.focus();
}

newEntryBtn.addEventListener('click', newEntry);

// ─── Save entry ───────────────────────────────────────────────
saveBtn.addEventListener('click', saveCurrentEntry);

function saveCurrentEntry() {
  const title = entryTitle.value.trim() || 'Untitled';
  const body  = entryBody.value.trim();
  if (!body) { showToast('Write something first 🌷'); return; }

  const date = dateInput.value;

  if (currentId) {
    // Update existing
    const idx = entries.findIndex(e => e.id === currentId);
    if (idx !== -1) {
      entries[idx] = { ...entries[idx], title, body, mood: selectedMood, date };
    }
    showToast('Entry updated 💾');
  } else {
    // New entry
    const entry = { id: generateId(), title, body, mood: selectedMood, date, aiResponse: '' };
    entries.unshift(entry);
    currentId = entry.id;
    showToast('Entry saved 🌸');
  }

  saveEntries();
  renderEntryList();
  drawMoodGraph();
}

// ─── Load entry ───────────────────────────────────────────────
function loadEntry(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;
  currentId        = entry.id;
  entryTitle.value = entry.title;
  entryBody.value  = entry.body;
  dateInput.value  = entry.date;
  updateDateDisplay(entry.date);
  setMood(entry.mood || 0);
  const words = entry.body.trim().split(/\s+/).filter(Boolean).length;
  charCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
  aiPanel.style.display = 'none';
  if (window.innerWidth <= 720) sidebar.classList.remove('open');
  highlightEntry(id);
}

function highlightEntry(id) {
  document.querySelectorAll('.entry-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });
}

// ─── Entry list ───────────────────────────────────────────────
function renderEntryList() {
  if (entries.length === 0) {
    entryList.innerHTML = '<div class="empty-state">No entries yet.<br/>Write your first one →</div>';
    return;
  }
  entryList.innerHTML = entries.map(entry => `
    <div class="entry-item" data-id="${entry.id}">
      <div class="entry-item-title">${escHtml(entry.title || 'Untitled')}</div>
      <div class="entry-item-meta">
        <span>${formatDate(entry.date)}</span>
        ${entry.mood ? `<span class="entry-mood-badge">${moodEmoji(entry.mood)}</span>` : ''}
      </div>
    </div>
  `).join('');

  entryList.querySelectorAll('.entry-item').forEach(el => {
    el.addEventListener('click', () => loadEntry(el.dataset.id));
  });

  if (currentId) highlightEntry(currentId);
}

function moodEmoji(m) {
  return ['','😞','😕','😐','🙂','😄'][m] || '';
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── AI Response ──────────────────────────────────────────────
askAiBtn.addEventListener('click', async () => {
  const body = entryBody.value.trim();
  if (!body) { showToast('Write something first so I can read it 🌸'); return; }
  if (!config.apiKey) { showToast('Add your API key in settings ⚙️'); return; }

  aiPanel.style.display = 'block';
  aiLoading.style.display = 'flex';
  aiText.style.display = 'none';
  aiText.textContent = '';
  askAiBtn.disabled = true;

  // Scroll into view
  setTimeout(() => aiPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);

  try {
    const response = await fetch(`${window.BACKEND_URL}/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Here is my diary entry:\n\n"${body}"\n\nPlease respond as my diary companion.\n\nYou are a warm, gentle, and empathetic diary companion. When someone shares a diary entry with you, respond with thoughtful reflection — acknowledge their feelings, offer gentle insights, and leave them feeling heard and understood. Keep your response to 3–5 sentences. Use a soft, caring tone. Never be preachy or give unsolicited advice unless they ask. Sign off warmly.`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'API error');
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Something went wrong. Please try again.';

    // Save AI response to entry
    if (currentId) {
      const idx = entries.findIndex(e => e.id === currentId);
      if (idx !== -1) entries[idx].aiResponse = text;
      saveEntries();
    }

    aiLoading.style.display = 'none';
    aiText.style.display = 'block';
    typeText(aiText, text);
  } catch (err) {
    aiLoading.style.display = 'none';
    aiText.style.display = 'block';
    aiText.textContent = `Couldn't connect to AI: ${err.message}. Check your API key in settings.`;
  } finally {
    askAiBtn.disabled = false;
  }
});

// Typing animation for AI response
function typeText(el, text, speed = 18) {
  el.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

aiClose.addEventListener('click', () => {
  aiPanel.style.display = 'none';
});

// ─── Mood Graph ───────────────────────────────────────────────
function drawMoodGraph() {
  const canvas = $('moodCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Build last 7 days
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    const entry = entries.find(e => e.date === iso);
    days.push({ iso, mood: entry?.mood || 0, label: d.toLocaleDateString('en-US', { weekday: 'short' }) });
  }

  const PAD_L = 8, PAD_R = 8, PAD_T = 10, PAD_B = 22;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const stepX = plotW / 6;

  // Grid lines (subtle)
  ctx.strokeStyle = 'rgba(200,180,200,0.2)';
  ctx.lineWidth = 1;
  for (let m = 1; m <= 5; m++) {
    const y = PAD_T + plotH - ((m - 1) / 4) * plotH;
    ctx.beginPath();
    ctx.moveTo(PAD_L, y);
    ctx.lineTo(W - PAD_R, y);
    ctx.stroke();
  }

  // Collect points
  const points = days.map((d, i) => ({
    x: PAD_L + i * stepX,
    y: d.mood > 0 ? PAD_T + plotH - ((d.mood - 1) / 4) * plotH : null,
    label: d.label,
    mood: d.mood
  }));

  // Fill area
  const filled = points.filter(p => p.y !== null);
  if (filled.length >= 2) {
    const grad = ctx.createLinearGradient(0, PAD_T, 0, H - PAD_B);
    grad.addColorStop(0, 'rgba(232,156,174,0.35)');
    grad.addColorStop(1, 'rgba(167,139,250,0.05)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(filled[0].x, H - PAD_B);
    ctx.lineTo(filled[0].x, filled[0].y);
    for (let i = 1; i < filled.length; i++) {
      const prev = filled[i - 1];
      const curr = filled[i];
      const cpx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
    }
    ctx.lineTo(filled[filled.length - 1].x, H - PAD_B);
    ctx.closePath();
    ctx.fill();
  }

  // Line
  if (filled.length >= 2) {
    const lineGrad = ctx.createLinearGradient(0, 0, W, 0);
    lineGrad.addColorStop(0, '#e89cae');
    lineGrad.addColorStop(1, '#a78bfa');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2.2;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(filled[0].x, filled[0].y);
    for (let i = 1; i < filled.length; i++) {
      const prev = filled[i - 1];
      const curr = filled[i];
      const cpx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
    }
    ctx.stroke();
  }

  // Dots & labels
  points.forEach(p => {
    // Day label
    ctx.fillStyle = 'rgba(155,125,139,0.8)';
    ctx.font = `500 8px "DM Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(p.label, p.x, H - 4);

    if (p.y !== null) {
      // Dot glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(232,156,174,0.2)';
      ctx.fill();
      // Dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#e89cae';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else {
      // Empty dot
      ctx.beginPath();
      ctx.arc(p.x, H - PAD_B - 4, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,180,200,0.4)';
      ctx.fill();
    }
  });
}

// ─── Export ───────────────────────────────────────────────────
exportBtn.addEventListener('click', () => {
  if (entries.length === 0) { showToast('Nothing to export yet 🌷'); return; }
  const lines = entries.map(e =>
    `━━━ ${e.date} | ${moodEmoji(e.mood)} ━━━\n${e.title}\n\n${e.body}${e.aiResponse ? '\n\n~ Diary companion said:\n' + e.aiResponse : ''}`
  ).join('\n\n\n');
  const blob = new Blob([`${config.diaryName}\n${'─'.repeat(40)}\n\n${lines}`], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `${config.diaryName.replace(/\s+/g, '_')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Exported! 📄');
});

// ─── Settings modal ───────────────────────────────────────────
settingsBtn.addEventListener('click', () => {
  settingsDiaryName.value = config.diaryName;
  settingsApiKey.value    = config.apiKey;
  settingsModal.style.display = 'flex';
});

settingsCancel.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

settingsModal.addEventListener('click', e => {
  if (e.target === settingsModal) settingsModal.style.display = 'none';
});

settingsSave.addEventListener('click', () => {
  const name = settingsDiaryName.value.trim();
  const key  = settingsApiKey.value.trim();
  if (!name) { showToast('Diary name cannot be empty 🌸'); return; }
  if (!key)  { showToast('API key cannot be empty ✨'); return; }
  config.diaryName = name;
  config.apiKey    = key;
  saveConfig();
  diaryNameDisplay.textContent = name;
  document.title = name;
  settingsModal.style.display = 'none';
  showToast('Settings saved 🌷');
});

// ─── Sidebar toggle (mobile) ──────────────────────────────────
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside (mobile)
document.addEventListener('click', e => {
  if (window.innerWidth <= 720
    && sidebar.classList.contains('open')
    && !sidebar.contains(e.target)
    && !sidebarToggle.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// ─── Toast ────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ─── Keyboard shortcuts ───────────────────────────────────────
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault();
    saveCurrentEntry();
  }
  if (e.key === 'Escape' && settingsModal.style.display !== 'none') {
    settingsModal.style.display = 'none';
  }
});

// ─── Start ────────────────────────────────────────────────────
init();
