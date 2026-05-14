# 🌸 Pastel Diary

A soft, dreamy personal diary with mood tracking, AI-free privacy, and a beautiful pastel aesthetic.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **5 Themes** | Pink, Lavender, Mint, Peach, Sky — switchable anytime |
| 🌙 **Dark Mode** | Elegant dark theme, toggled from the sidebar or Settings |
| 🔒 **PIN Lock** | Optional 4-digit PIN to protect your diary on load |
| 🏷️ **Tags** | Add tags to entries, filter the sidebar by tag |
| 📸 **Photos** | Attach one photo per entry — auto-compressed, stored locally |
| 💡 **Writing Prompts** | 25 thoughtful prompts to help you start writing |
| ⏰ **Daily Reminder** | Browser notification at a time you choose |
| 📊 **Mood Graph** | Smooth bezier curve showing your mood over the last 7 days |
| 💾 **Local Storage** | All data stays in your browser — no server, no tracking |
| 📤 **Export** | Download all entries as a `.txt` file |
| ⌨️ **Keyboard** | `Ctrl / Cmd + S` to save from anywhere |
| 📱 **Responsive** | Full sidebar toggle and layout on mobile |

---

## 🚀 Running Locally

### Option 1 — VS Code Live Server (recommended)
1. Open the project folder in VS Code
2. Install the **Live Server** extension (by Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**
4. Opens at `http://127.0.0.1:5500`

### Option 2 — Python server
```bash
python -m http.server 8080
# Open http://localhost:8080
```

### Option 3 — Just open the file
Double-click `index.html` — everything works except Daily Reminders  
(browsers may block notifications from `file://` URLs).

---

## 🌐 Deployment

This is a **pure static app** — no build step, no backend needed.

### Vercel (recommended)
1. Push the folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **Add New → Project**
3. Import your repo → **Framework: Other** → **Deploy**
4. Done! Your diary is live at `https://your-app.vercel.app`

### Netlify
1. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
2. Select your repo → **Deploy site**

### GitHub Pages
1. Go to your repo → **Settings → Pages**
2. Source: **Deploy from a branch** → `main` / `root`
3. Save — live at `https://username.github.io/repo-name`

---

## 📁 File Structure

```
pastel-diary/
├── index.html        ← structure & layout
├── style.css         ← all styling, themes, animations
├── script.js         ← all logic, storage, features
├── gemini-proxy.js   ← (legacy backend, not used by frontend)
├── package.json      ← backend dependencies
├── .env              ← 🔒 local secrets (gitignored)
├── .env.example      ← template (safe to commit)
├── .gitignore
└── README.md
```

---

## 💡 Tips

- **Ctrl/Cmd + S** saves your entry from anywhere
- Click ✏️ next to the date to backdate an entry
- Type a tag name + **Enter** to add it — click tags in sidebar to filter
- Click **💡 Get a prompt** if you don't know what to write
- All data is stored in your browser's `localStorage` — it's private and offline

---

## 🔒 Privacy

- **No accounts.** No sign-in required.
- **No server.** Entries never leave your device.
- **No tracking.** No analytics, no cookies.
- Your PIN is stored in `localStorage` — only you can access it on your device.

---

*Made with pastels, patience, and care 🌸*
