# 🌸 PastelDiary — Upgraded

A soft, dreamy personal diary with **real Claude AI responses**, mood tracking, and a beautiful pastel aesthetic.

---

## ✨ What's better than the original

| Feature | Original | This version |
|---|---|---|
| AI responses | Keyword detection (fake) | Real Claude AI (claude-sonnet) |
| UI design | Basic pastel | Animated glassmorphism, floating blobs |
| Fonts | Generic | Cormorant Garamond + DM Sans |
| Mood graph | Canvas bar chart | Smooth bezier curve with gradient fill |
| Settings | None | Edit diary name + API key anytime |
| Export | None | Export all entries as .txt |
| Keyboard | None | Ctrl/Cmd + S to save |
| Mobile | Basic | Full sidebar toggle, responsive layout |

---

## 🚀 How to run locally

### Option 1 — VS Code Live Server (recommended)
1. Open the `PastelDiary/` folder in VS Code
2. Install the **Live Server** extension (by Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**
4. Opens at `http://127.0.0.1:5500`

### Option 2 — Python server
```bash
cd PastelDiary
python -m http.server 8080
# Open http://localhost:8080
```

### Option 3 — Just open the file
Double-click `index.html` — works for everything except AI calls  
(browsers block API calls from `file://` for security reasons).  
Use Live Server or Python for full AI functionality.

---

## 🔑 Getting your Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign in / create an account
3. Navigate to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)
5. Paste it into the diary's setup screen

**Your key is stored only in your browser's localStorage.** It's never sent anywhere except directly to `api.anthropic.com`.

---

## 📁 File structure

```
PastelDiary/
├── index.html   ← structure & layout
├── style.css    ← all styling & animations
├── script.js    ← logic, AI, storage, graph
└── README.md    ← this file
```

---

## 🌐 Deploying to Vercel

1. Push the folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import project
3. Select your repo → Deploy (no build step needed)
4. Share the URL!

---

## 💡 Tips

- **Ctrl/Cmd + S** saves your entry from anywhere
- Click the ✏️ next to the date to change it (backdating supported)
- Click **✨ Ask AI** after writing to get a thoughtful response
- All data stays in your browser — no server, no tracking
- Use **Export 📄** in the sidebar to download all your entries

---

*Made with pastels, patience, and a real AI companion 🌸*
