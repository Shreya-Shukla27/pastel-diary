# 🌸 Pastel Diary

A soft, dreamy personal diary with cloud storage, mood tracking, and a beautiful pastel aesthetic.

🔗 **Live:** [pastel-diary-roan.vercel.app](https://pastel-diary-roan.vercel.app)

---

## ✨ Features

| Feature | Description |
|---|---|
| ☁️ **Cloud Storage** | Entries saved to MongoDB — accessible from any device |
| 🎨 **5 Themes** | Pink, Lavender, Mint, Peach, Sky — switchable anytime |
| 🌙 **Dark Mode** | Elegant dark theme, toggled from sidebar or Settings |
| 🔒 **PIN Lock** | Optional 4-digit PIN to protect your diary on load |
| 🏷️ **Tags** | Add tags to entries, filter the sidebar by tag |
| 📸 **Photos** | Attach one photo per entry — auto-compressed |
| 💡 **Writing Prompts** | 21 thoughtful prompts to help you start writing |
| ⏰ **Daily Reminder** | Browser notification at a time you choose |
| 📊 **Mood Graph** | Smooth bezier curve showing mood over last 7 days |
| 📤 **Export** | Download all entries as a `.txt` file |
| ⌨️ **Keyboard** | `Ctrl / Cmd + S` saves from anywhere |
| 📱 **Responsive** | Full mobile layout with sidebar toggle |

---

## 🏗️ Architecture

```
Frontend  →  Vercel  (static HTML/CSS/JS)
Backend   →  Render  (Express.js API)
Database  →  MongoDB Atlas  (cloud DB)
```

Each user gets a unique diary ID generated on first setup. All entries and settings are stored in MongoDB, accessible from any device.

---

## 📁 File Structure

```
pastel-diary/
├── index.html        ← app structure & layout
├── style.css         ← all styling, themes & animations
├── script.js         ← frontend logic (calls backend API)
├── config.js         ← frontend: set BACKEND_URL here
├── server.js         ← Express.js backend (deploy to Render)
├── package.json      ← backend dependencies
├── .env.example      ← env variable template
├── .gitignore
└── README.md
```

---

## 🚀 Local Development

### 1. Clone the repo
```bash
git clone https://github.com/Shreya-Shukla27/pastel-diary.git
cd pastel-diary
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env and fill in your MongoDB URI
```

### 3. Start the backend
```bash
npm install
node server.js
# → Running on http://localhost:3001
```

### 4. Open the frontend
Use VS Code Live Server or:
```bash
python -m http.server 8080
# Open http://localhost:8080
```

> Make sure `config.js` has `window.BACKEND_URL = 'http://localhost:3001'` for local dev.

---

## 🌐 Deployment

### Frontend → Vercel
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import repo
3. **Framework:** `Other` → **Deploy**

### Backend → Render
1. Go to [render.com](https://render.com) → **New Web Service** → import repo
2. **Build Command:** `npm install`
3. **Start Command:** `node server.js`
4. Add environment variables:

| Variable | Value |
|---|---|
| `MONGODB_URI` | your Atlas connection string |
| `FRONTEND_URL` | your Vercel URL |
| `PORT` | `3001` |

### Database → MongoDB Atlas
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → create free M0 cluster
2. **Database Access** → create a user
3. **Network Access** → allow `0.0.0.0/0`
4. **Connect → Drivers** → copy connection string

---

## 💡 Tips

- **Ctrl/Cmd + S** saves your entry from anywhere
- Click ✏️ next to the date to backdate an entry
- Type a tag + **Enter** to add it — click tags in sidebar to filter
- Entries sync across all your devices automatically

---

## 🔒 Privacy

- No third-party tracking or analytics
- Your diary ID is stored only in your browser
- PIN lock adds an extra layer of local protection

---

## 🤝 Contributing

Contributions, feature suggestions, and bug reports are welcome.
Feel free to open an issue or submit a pull request.
⭐ If you like this project, consider giving it a star.

---

*Made with pastels, patience, and care 🌸*
