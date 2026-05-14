/* PASTEL DIARY — script.js */

// ─── Constants ────────────────────────────────────────────────
const DB_KEY  = 'pastel_diary_entries';
const CFG_KEY = 'pastel_diary_config';
const PROMPTS = [
  "What made you smile today, even just a little?",
  "Describe a moment of peace you found recently.",
  "What's one thing you're grateful for right now?",
  "Write about someone who made a difference in your life.",
  "What's a challenge you're facing? How might you approach it differently?",
  "Describe your perfect day in detail.",
  "What's something you've been putting off? Why?",
  "Write about a recent conversation that stuck with you.",
  "If you could talk to your younger self, what would you say?",
  "What's a small victory you've had recently?",
  "Describe a place that makes you feel safe and calm.",
  "What's been on your mind that you haven't told anyone?",
  "Write about something you're looking forward to.",
  "What's a habit you want to start or stop?",
  "How have you grown in the past year?",
  "Write about a memory that always makes you happy.",
  "What does your ideal life look like?",
  "What's something you need to forgive yourself for?",
  "Describe how you're feeling right now using only colors.",
  "What are three things that went well today?",
  "Write about someone you miss.",
  "What would you do if you knew you couldn't fail?",
  "What does 'home' mean to you?",
  "Write about a time you felt truly proud of yourself.",
  "What's something beautiful you noticed today?",
];

// ─── State ────────────────────────────────────────────────────
let entries = [], currentId = null, selectedMood = 0, currentTags = [],
    currentPhoto = null, activeTagFilter = null, pinBuffer = '',
    config = { diaryName:'My Diary', theme:'pink', dark:false, pin:'', reminderTime:'' };

// ─── DOM ──────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const setupScreen=$('setupScreen'),appEl=$('app'),pinScreen=$('pinScreen');
const diaryNameInput=$('diaryNameInput'),pinSetupInput=$('pinSetupInput'),setupBtn=$('setupBtn');
const diaryNameDisplay=$('diaryNameDisplay'),dateDisplay=$('dateDisplay');
const dateEditBtn=$('dateEditBtn'),dateInput=$('dateInput');
const moodPicks=$('moodPicks'),entryTitle=$('entryTitle'),entryBody=$('entryBody');
const charCount=$('charCount'),saveBtn=$('saveBtn');
const entryList=$('entryList'),newEntryBtn=$('newEntryBtn'),exportBtn=$('exportBtn');
const settingsBtn=$('settingsBtn'),settingsModal=$('settingsModal');
const settingsDiaryName=$('settingsDiaryName'),settingsPin=$('settingsPin');
const settingsCancel=$('settingsCancel'),settingsSave=$('settingsSave');
const toast=$('toast'),sidebarToggle=$('sidebarToggle');
const sidebar=document.querySelector('.sidebar');
const darkModeBtn=$('darkModeBtn'),darkModeToggle=$('darkModeToggle');
const tagInput=$('tagInput'),tagsDisplay=$('tagsDisplay'),tagFilterList=$('tagFilterList');
const photoInput=$('photoInput'),photoPreview=$('photoPreview'),photoImg=$('photoImg'),photoRemove=$('photoRemove');
const promptBtn=$('promptBtn'),promptBubble=$('promptBubble'),promptText=$('promptText'),promptUse=$('promptUse'),promptNext=$('promptNext');
const pinDots=$('pinDots'),pinError=$('pinError'),pinDiaryName=$('pinDiaryName');
const reminderTime=$('reminderTime'),reminderBtn=$('reminderBtn'),reminderClear=$('reminderClear');

// ─── Init ─────────────────────────────────────────────────────
function init() {
  loadConfig(); loadEntries();
  applyTheme(config.theme); applyDark(config.dark);

  if (!config.diaryName || config.diaryName === 'My Diary' && !localStorage.getItem(CFG_KEY)) {
    setupScreen.style.display = 'flex'; return;
  }
  if (config.pin) { showPinScreen(); return; }
  launchApp();
}

// ─── Config ───────────────────────────────────────────────────
function loadConfig() { const r=localStorage.getItem(CFG_KEY); if(r) config={...config,...JSON.parse(r)}; }
function saveConfig() { localStorage.setItem(CFG_KEY,JSON.stringify(config)); }

// ─── Entries ──────────────────────────────────────────────────
function loadEntries() { const r=localStorage.getItem(DB_KEY); entries=r?JSON.parse(r):[]; }
function saveEntries() { localStorage.setItem(DB_KEY,JSON.stringify(entries)); }
function genId() { return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }

// ─── Setup ────────────────────────────────────────────────────
setupBtn.addEventListener('click', () => {
  const name = diaryNameInput.value.trim();
  if (!name) { showToast('Please give your diary a name 🌸'); return; }
  const pin = pinSetupInput.value.trim();
  if (pin && !/^\d{4}$/.test(pin)) { showToast('PIN must be exactly 4 digits'); return; }
  config.diaryName = name;
  config.pin = pin;
  saveConfig();
  setupScreen.style.display = 'none';
  launchApp();
});
diaryNameInput.addEventListener('keydown', e => { if(e.key==='Enter') setupBtn.click(); });

// ─── PIN Screen ────────────────────────────────────────────────
function showPinScreen() {
  pinScreen.style.display = 'flex';
  pinDiaryName.textContent = config.diaryName;
  updatePinDots();
}
function updatePinDots() {
  pinScreen.querySelectorAll('.pin-dot').forEach((d,i) => d.classList.toggle('filled', i < pinBuffer.length));
}
pinScreen.addEventListener('click', e => {
  const key = e.target.closest('.pin-key')?.dataset.key;
  if (!key) return;
  if (key === 'back') { pinBuffer = pinBuffer.slice(0,-1); }
  else if (key === 'clear') { pinBuffer = ''; }
  else if (pinBuffer.length < 4) { pinBuffer += key; }
  updatePinDots();
  if (pinBuffer.length === 4) {
    if (pinBuffer === config.pin) {
      pinScreen.style.display = 'none'; pinBuffer = ''; launchApp();
    } else {
      pinError.textContent = 'Incorrect PIN. Try again.';
      pinBuffer = ''; updatePinDots();
      setTimeout(() => pinError.textContent = '', 1500);
    }
  }
});

// ─── Launch App ────────────────────────────────────────────────
function launchApp() {
  appEl.style.display = 'grid';
  diaryNameDisplay.textContent = config.diaryName;
  document.title = config.diaryName;
  setTodayDate(); renderEntryList(); drawMoodGraph(); newEntry();
  renderTagFilter();
  if (config.reminderTime) scheduleReminder(config.reminderTime);
}

// ─── Date ─────────────────────────────────────────────────────
function setTodayDate() { const t=new Date().toISOString().split('T')[0]; dateInput.value=t; updateDateDisplay(t); }
function updateDateDisplay(v) { dateDisplay.textContent=new Date(v+'T00:00:00').toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}); }
dateEditBtn.addEventListener('click',()=>{ const h=dateInput.style.display==='none'; dateInput.style.display=h?'inline-block':'none'; if(h)dateInput.focus(); });
dateInput.addEventListener('change',()=>{ updateDateDisplay(dateInput.value); dateInput.style.display='none'; });

// ─── Mood ──────────────────────────────────────────────────────
moodPicks.addEventListener('click',e=>{ const b=e.target.closest('.mood-btn'); if(!b)return; document.querySelectorAll('.mood-btn').forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); selectedMood=parseInt(b.dataset.mood); });
function setMood(v) { selectedMood=v; document.querySelectorAll('.mood-btn').forEach(b=>b.classList.toggle('selected',parseInt(b.dataset.mood)===v)); }

// ─── Word count ────────────────────────────────────────────────
entryBody.addEventListener('input',()=>{ const w=entryBody.value.trim().split(/\s+/).filter(Boolean).length; charCount.textContent=`${w} word${w!==1?'s':''}`; });

// ─── New Entry ─────────────────────────────────────────────────
function newEntry() {
  currentId=null; entryTitle.value=''; entryBody.value='';
  charCount.textContent='0 words'; setTodayDate(); setMood(0);
  currentTags=[]; currentPhoto=null; renderCurrentTags();
  photoPreview.style.display='none'; photoImg.src='';
  promptBubble.style.display='none';
  document.querySelectorAll('.entry-item').forEach(e=>e.classList.remove('active'));
  entryTitle.focus();
}
newEntryBtn.addEventListener('click', newEntry);

// ─── Save ──────────────────────────────────────────────────────
saveBtn.addEventListener('click', saveCurrentEntry);
function saveCurrentEntry() {
  const title=entryTitle.value.trim()||'Untitled', body=entryBody.value.trim();
  if (!body) { showToast('Write something first 🌷'); return; }
  const date=dateInput.value;
  const entryData={ title, body, mood:selectedMood, date, tags:[...currentTags], photo:currentPhoto||'' };
  if (currentId) {
    const i=entries.findIndex(e=>e.id===currentId);
    if(i!==-1) entries[i]={...entries[i],...entryData};
    showToast('Entry updated 💾');
  } else {
    const entry={id:genId(),...entryData};
    entries.unshift(entry); currentId=entry.id;
    showToast('Entry saved 🌸');
  }
  saveEntries(); renderEntryList(); drawMoodGraph(); renderTagFilter();
}

// ─── Load Entry ────────────────────────────────────────────────
function loadEntry(id) {
  const e=entries.find(x=>x.id===id); if(!e)return;
  currentId=e.id; entryTitle.value=e.title; entryBody.value=e.body;
  dateInput.value=e.date; updateDateDisplay(e.date); setMood(e.mood||0);
  currentTags=[...(e.tags||[])]; renderCurrentTags();
  currentPhoto=e.photo||null;
  if(currentPhoto){ photoImg.src=currentPhoto; photoPreview.style.display='block'; }
  else { photoPreview.style.display='none'; photoImg.src=''; }
  const w=e.body.trim().split(/\s+/).filter(Boolean).length;
  charCount.textContent=`${w} word${w!==1?'s':''}`;
  promptBubble.style.display='none';
  if(window.innerWidth<=720) sidebar.classList.remove('open');
  highlightEntry(id);
}
function highlightEntry(id) { document.querySelectorAll('.entry-item').forEach(el=>el.classList.toggle('active',el.dataset.id===id)); }

// ─── Entry List ────────────────────────────────────────────────
function renderEntryList() {
  const list=activeTagFilter ? entries.filter(e=>(e.tags||[]).includes(activeTagFilter)) : entries;
  if(!list.length){ entryList.innerHTML=`<div class="empty-state">${activeTagFilter?'No entries with this tag.':'No entries yet.<br/>Write your first one →'}</div>`; return; }
  entryList.innerHTML=list.map(e=>`
    <div class="entry-item" data-id="${e.id}">
      <div class="entry-item-title">${escHtml(e.title||'Untitled')}</div>
      <div class="entry-item-meta">
        <span>${fmtDate(e.date)}</span>
        ${e.mood?`<span>${moodEmoji(e.mood)}</span>`:''}
        ${e.photo?`<img class="entry-thumb" src="${e.photo}" alt=""/>`:''}
      </div>
      ${(e.tags||[]).length?`<div class="entry-tags-preview">${e.tags.map(t=>`<span class="entry-tag-mini">#${escHtml(t)}</span>`).join('')}</div>`:''}
    </div>`).join('');
  entryList.querySelectorAll('.entry-item').forEach(el=>el.addEventListener('click',()=>loadEntry(el.dataset.id)));
  if(currentId) highlightEntry(currentId);
}
function moodEmoji(m){ return['','😞','😕','😐','🙂','😄'][m]||''; }
function fmtDate(iso){ if(!iso)return''; return new Date(iso+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}); }
function escHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ─── Tags ──────────────────────────────────────────────────────
tagInput.addEventListener('keydown',e=>{
  if(e.key!=='Enter') return; e.preventDefault();
  const tag=tagInput.value.trim().toLowerCase().replace(/\s+/g,'-');
  if(!tag||currentTags.includes(tag)) { tagInput.value=''; return; }
  currentTags.push(tag); tagInput.value=''; renderCurrentTags();
});
function renderCurrentTags() {
  tagsDisplay.innerHTML=currentTags.map((t,i)=>`<span class="tag-pill">#${escHtml(t)}<button data-i="${i}">×</button></span>`).join('');
  tagsDisplay.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ currentTags.splice(+b.dataset.i,1); renderCurrentTags(); }));
}
function renderTagFilter() {
  const all=[...new Set(entries.flatMap(e=>e.tags||[]))];
  if(!all.length){ tagFilterList.innerHTML='<span class="tag-empty">No tags yet</span>'; return; }
  tagFilterList.innerHTML=all.map(t=>`<button class="tag-filter-chip${activeTagFilter===t?' active':''}" data-tag="${escHtml(t)}">#${escHtml(t)}</button>`).join('');
  tagFilterList.querySelectorAll('.tag-filter-chip').forEach(b=>b.addEventListener('click',()=>{
    activeTagFilter=activeTagFilter===b.dataset.tag?null:b.dataset.tag;
    renderTagFilter(); renderEntryList();
  }));
}

// ─── Photo ─────────────────────────────────────────────────────
photoInput.addEventListener('change',()=>{
  const file=photoInput.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    const img=new Image();
    img.onload=()=>{
      const c=document.createElement('canvas');
      const max=600; let w=img.width,h=img.height;
      if(w>max){h=h*(max/w);w=max;} if(h>max){w=w*(max/h);h=max;}
      c.width=w;c.height=h;
      c.getContext('2d').drawImage(img,0,0,w,h);
      currentPhoto=c.toDataURL('image/jpeg',.7);
      photoImg.src=currentPhoto; photoPreview.style.display='block';
    };
    img.src=ev.target.result;
  };
  reader.readAsDataURL(file);
  photoInput.value='';
});
photoRemove.addEventListener('click',()=>{ currentPhoto=null; photoPreview.style.display='none'; photoImg.src=''; });
document.querySelector('.photo-label').addEventListener('click',()=>photoInput.click());

// ─── Writing Prompts ───────────────────────────────────────────
let lastPromptIdx=-1;
function getPrompt() {
  let i; do{ i=Math.floor(Math.random()*PROMPTS.length); }while(i===lastPromptIdx&&PROMPTS.length>1);
  lastPromptIdx=i; return PROMPTS[i];
}
promptBtn.addEventListener('click',()=>{ promptText.textContent=getPrompt(); promptBubble.style.display='flex'; });
promptNext.addEventListener('click',()=>{ promptText.textContent=getPrompt(); });
promptUse.addEventListener('click',()=>{ entryBody.value=(entryBody.value?entryBody.value+'\n\n':'')+promptText.textContent; promptBubble.style.display='none'; entryBody.focus(); });

// ─── Themes ────────────────────────────────────────────────────
function applyTheme(t) { document.documentElement.setAttribute('data-theme',t); config.theme=t; syncThemeSwatches(t); }
function syncThemeSwatches(t) { document.querySelectorAll('.theme-swatch').forEach(s=>s.classList.toggle('active',s.dataset.theme===t)); }
document.querySelectorAll('.theme-swatch').forEach(s=>s.addEventListener('click',()=>{ applyTheme(s.dataset.theme); saveConfig(); }));

// ─── Dark Mode ─────────────────────────────────────────────────
function applyDark(on) {
  document.documentElement.setAttribute('data-dark',on);
  config.dark=on;
  const label=on?'☀️ Light':'🌙 Dark';
  darkModeBtn.textContent=on?'☀️':'🌙';
  if(darkModeToggle){ darkModeToggle.textContent=label; darkModeToggle.classList.toggle('on',on); }
}
darkModeBtn.addEventListener('click',()=>{ applyDark(!config.dark); saveConfig(); });
darkModeToggle.addEventListener('click',()=>{ applyDark(!config.dark); saveConfig(); });

// ─── Daily Reminder ────────────────────────────────────────────
reminderBtn.addEventListener('click',()=>{
  const t=reminderTime.value; if(!t){ showToast('Pick a time first ⏰'); return; }
  if(!('Notification' in window)){ showToast('Notifications not supported'); return; }
  Notification.requestPermission().then(p=>{
    if(p!=='granted'){ showToast('Please allow notifications'); return; }
    config.reminderTime=t; saveConfig(); scheduleReminder(t); showToast(`Reminder set for ${t} 🔔`);
  });
});
reminderClear.addEventListener('click',()=>{ config.reminderTime=''; saveConfig(); showToast('Reminder cleared'); });
function scheduleReminder(timeStr) {
  const [h,m]=timeStr.split(':').map(Number);
  const now=new Date(), target=new Date();
  target.setHours(h,m,0,0);
  if(target<=now) target.setDate(target.getDate()+1);
  const ms=target-now;
  setTimeout(()=>{
    new Notification(`🌸 ${config.diaryName}`,{body:'Time to write in your diary!',icon:'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><text y=%2228%22 font-size=%2228%22>🌸</text></svg>'});
    scheduleReminder(timeStr);
  },ms);
}

// ─── Mood Graph ────────────────────────────────────────────────
function drawMoodGraph() {
  const canvas=$('moodCanvas'); if(!canvas)return;
  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
  ctx.clearRect(0,0,W,H);
  const days=[]; for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); const iso=d.toISOString().split('T')[0]; const en=entries.find(e=>e.date===iso); days.push({iso,mood:en?.mood||0,label:d.toLocaleDateString('en-US',{weekday:'short'})}); }
  const PL=8,PR=8,PT=10,PB=22,plotW=W-PL-PR,plotH=H-PT-PB,stepX=plotW/6;
  ctx.strokeStyle='rgba(200,180,200,0.2)'; ctx.lineWidth=1;
  for(let m=1;m<=5;m++){ const y=PT+plotH-((m-1)/4)*plotH; ctx.beginPath(); ctx.moveTo(PL,y); ctx.lineTo(W-PR,y); ctx.stroke(); }
  const pts=days.map((d,i)=>({x:PL+i*stepX,y:d.mood>0?PT+plotH-((d.mood-1)/4)*plotH:null,label:d.label}));
  const filled=pts.filter(p=>p.y!==null);
  if(filled.length>=2){
    const g=ctx.createLinearGradient(0,PT,0,H-PB); g.addColorStop(0,'rgba(232,156,174,0.35)'); g.addColorStop(1,'rgba(167,139,250,0.05)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.moveTo(filled[0].x,H-PB); ctx.lineTo(filled[0].x,filled[0].y);
    for(let i=1;i<filled.length;i++){ const p=filled[i-1],c=filled[i],cx=(p.x+c.x)/2; ctx.bezierCurveTo(cx,p.y,cx,c.y,c.x,c.y); }
    ctx.lineTo(filled[filled.length-1].x,H-PB); ctx.closePath(); ctx.fill();
    const lg=ctx.createLinearGradient(0,0,W,0); lg.addColorStop(0,'#e89cae'); lg.addColorStop(1,'#a78bfa');
    ctx.strokeStyle=lg; ctx.lineWidth=2.2; ctx.lineJoin='round'; ctx.beginPath(); ctx.moveTo(filled[0].x,filled[0].y);
    for(let i=1;i<filled.length;i++){ const p=filled[i-1],c=filled[i],cx=(p.x+c.x)/2; ctx.bezierCurveTo(cx,p.y,cx,c.y,c.x,c.y); }
    ctx.stroke();
  }
  pts.forEach(p=>{ ctx.fillStyle='rgba(155,125,139,0.8)'; ctx.font='500 8px "DM Sans",sans-serif'; ctx.textAlign='center'; ctx.fillText(p.label,p.x,H-4); if(p.y!==null){ ctx.beginPath(); ctx.arc(p.x,p.y,6,0,Math.PI*2); ctx.fillStyle='rgba(232,156,174,0.2)'; ctx.fill(); ctx.beginPath(); ctx.arc(p.x,p.y,3.5,0,Math.PI*2); ctx.fillStyle='#e89cae'; ctx.fill(); ctx.strokeStyle='white'; ctx.lineWidth=1.5; ctx.stroke(); } else { ctx.beginPath(); ctx.arc(p.x,H-PB-4,2,0,Math.PI*2); ctx.fillStyle='rgba(200,180,200,0.4)'; ctx.fill(); } });
}

// ─── Export ────────────────────────────────────────────────────
exportBtn.addEventListener('click',()=>{
  if(!entries.length){ showToast('Nothing to export yet 🌷'); return; }
  const lines=entries.map(e=>`━━━ ${e.date} | ${moodEmoji(e.mood)} ${(e.tags||[]).map(t=>'#'+t).join(' ')} ━━━\n${e.title}\n\n${e.body}`).join('\n\n\n');
  const blob=new Blob([`${config.diaryName}\n${'─'.repeat(40)}\n\n${lines}`],{type:'text/plain'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url; a.download=`${config.diaryName.replace(/\s+/g,'_')}.txt`; a.click();
  URL.revokeObjectURL(url); showToast('Exported! 📄');
});

// ─── Settings ──────────────────────────────────────────────────
settingsBtn.addEventListener('click',()=>{
  settingsDiaryName.value=config.diaryName;
  settingsPin.value='';
  if(reminderTime) reminderTime.value=config.reminderTime||'';
  syncThemeSwatches(config.theme);
  darkModeToggle.textContent=config.dark?'☀️ Light':'🌙 Dark';
  darkModeToggle.classList.toggle('on',config.dark);
  settingsModal.style.display='flex';
});
settingsCancel.addEventListener('click',()=>settingsModal.style.display='none');
settingsModal.addEventListener('click',e=>{ if(e.target===settingsModal) settingsModal.style.display='none'; });
settingsSave.addEventListener('click',()=>{
  const name=settingsDiaryName.value.trim();
  if(!name){ showToast('Diary name cannot be empty 🌸'); return; }
  const pin=settingsPin.value.trim();
  if(pin && !/^\d{4}$/.test(pin)){ showToast('PIN must be 4 digits'); return; }
  config.diaryName=name; if(pin!==''||settingsPin.value==='') config.pin=pin;
  saveConfig(); diaryNameDisplay.textContent=name; document.title=name;
  settingsModal.style.display='none'; showToast('Settings saved 🌷');
});

// ─── Sidebar ───────────────────────────────────────────────────
sidebarToggle.addEventListener('click',()=>sidebar.classList.toggle('open'));
document.addEventListener('click',e=>{ if(window.innerWidth<=720&&sidebar.classList.contains('open')&&!sidebar.contains(e.target)&&!sidebarToggle.contains(e.target)) sidebar.classList.remove('open'); });

// ─── Toast ─────────────────────────────────────────────────────
let toastTimer;
function showToast(msg){ toast.textContent=msg; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('show'),2800); }

// ─── Keyboard shortcuts ────────────────────────────────────────
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key==='s'){ e.preventDefault(); saveCurrentEntry(); }
  if(e.key==='Escape'&&settingsModal.style.display!=='none') settingsModal.style.display='none';
});

// ─── Setup screen theme picker ─────────────────────────────────
$('setupThemePicker').querySelectorAll('.theme-swatch').forEach(s=>s.addEventListener('click',()=>{ applyTheme(s.dataset.theme); }));

// ─── Start ─────────────────────────────────────────────────────
init();
