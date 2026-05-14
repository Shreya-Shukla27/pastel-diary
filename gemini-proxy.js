require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Validate required env vars ──────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('❌  GEMINI_API_KEY is not set.');
  console.error('    Create a .env file based on .env.example and set your key.');
  process.exit(1);
}

// ─── CORS ─────────────────────────────────────────────────────────
// Allowed origins: your deployed Vercel URL + local dev origins.
// Set FRONTEND_URL in Railway env vars to your Vercel URL.
const FRONTEND_URL = process.env.FRONTEND_URL || '';

const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  ...(FRONTEND_URL ? [FRONTEND_URL] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, Postman, health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`⛔  CORS blocked request from: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
}));

app.use(express.json());

// ─── Health check ────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'pastel-diary-proxy' });
});

// ─── Gemini proxy ────────────────────────────────────────────────
app.post('/gemini', async (req, res) => {
  console.log('→ POST /gemini');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error('Gemini API error:', data.error);
      return res.status(500).json({ error: data.error });
    }

    res.json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── Start ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Pastel Diary proxy running → http://localhost:${PORT}`);
  console.log(`    CORS allowed origins: ${allowedOrigins.join(', ')}`);
});
