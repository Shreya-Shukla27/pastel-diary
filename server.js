require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── CORS ─────────────────────────────────────────────────────
const FRONTEND_URL = process.env.FRONTEND_URL || '';
const allowed = ['http://localhost:5500','http://127.0.0.1:5500','http://localhost:8080', FRONTEND_URL].filter(Boolean);
app.use(cors({ origin: (o, cb) => { if (!o || allowed.includes(o)) return cb(null, true); cb(new Error('Not allowed by CORS')); } }));
app.use(express.json({ limit: '10mb' })); // allow photos

// ─── MongoDB ──────────────────────────────────────────────────
if (!process.env.MONGODB_URI) { console.error('❌  MONGODB_URI not set'); process.exit(1); }
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅  MongoDB connected'))
  .catch(err => { console.error('MongoDB error:', err); process.exit(1); });

// ─── Schemas ──────────────────────────────────────────────────
const EntrySchema = new mongoose.Schema({
  diaryId:   { type: String, required: true, index: true },
  entryId:   { type: String, required: true },
  title:     String,
  body:      String,
  mood:      Number,
  date:      String,
  tags:      [String],
  photo:     String,
}, { timestamps: true });

const ConfigSchema = new mongoose.Schema({
  diaryId:      { type: String, required: true, unique: true },
  diaryName:    { type: String, default: 'My Diary' },
  theme:        { type: String, default: 'pink' },
  dark:         { type: Boolean, default: false },
  pin:          { type: String, default: '' },
  reminderTime: { type: String, default: '' },
});

const Entry  = mongoose.model('Entry', EntrySchema);
const Config = mongoose.model('Config', ConfigSchema);

// ─── Health ───────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'pastel-diary' }));

// ─── Config routes ────────────────────────────────────────────
app.get('/config/:diaryId', async (req, res) => {
  try { res.json(await Config.findOne({ diaryId: req.params.diaryId }) || {}); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/config/:diaryId', async (req, res) => {
  try {
    const cfg = await Config.findOneAndUpdate(
      { diaryId: req.params.diaryId }, req.body, { upsert: true, new: true }
    );
    res.json(cfg);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Entry routes ─────────────────────────────────────────────
app.get('/entries/:diaryId', async (req, res) => {
  try { res.json(await Entry.find({ diaryId: req.params.diaryId }).sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/entries/:diaryId', async (req, res) => {
  try { res.json(await Entry.create({ diaryId: req.params.diaryId, ...req.body })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/entries/:diaryId/:entryId', async (req, res) => {
  try {
    res.json(await Entry.findOneAndUpdate(
      { diaryId: req.params.diaryId, entryId: req.params.entryId }, req.body, { new: true }
    ));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/entries/:diaryId/:entryId', async (req, res) => {
  try { await Entry.findOneAndDelete({ diaryId: req.params.diaryId, entryId: req.params.entryId }); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`✅  Pastel Diary backend → http://localhost:${PORT}`));
