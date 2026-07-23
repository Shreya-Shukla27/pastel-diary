

# 🌸 Pastel Diary

> *A modern, aesthetic cloud-based journaling application designed for mindful writing.*

<p align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat\&logo=html5\&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat\&logo=css3\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat\&logo=javascript\&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat\&logo=node.js\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat\&logo=express\&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=flat\&logo=mongodb\&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat\&logo=mongoose\&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat\&logo=vercel\&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat\&logo=render\&logoColor=black)

</p>

<p align="center">

*A beautifully crafted digital journal with cloud sync, mood tracking, customizable themes, writing prompts, and a calming pastel-inspired interface.*

🌐 **Live Demo:** https://pastel-diary-roan.vercel.app

</p>

---

# ✨ Features

## 🎨 Beautiful User Experience

* 🌸 Premium pastel-inspired UI
* ✨ Elegant glassmorphism design
* 🌈 Five customizable themes
* 🌙 Dark & Light mode
* 🌸 Animated gradient background
* ✨ Floating particles & subtle animations
* 📱 Fully responsive across desktop, tablet, and mobile

---

## 📖 Journaling

* ☁️ Cloud-synced diary entries
* 😊 Mood selection for every journal
* 📝 Clean and distraction-free writing experience
* 📸 Attach photos to memories
* 🏷️ Organize entries using tags
* 🔍 Filter entries instantly
* ✏️ Backdate journal entries
* 💡 21 built-in writing prompts
* 📤 Export your diary as a `.txt` file

---

## 🔐 Privacy & Security

* 🔒 Optional 4-digit PIN protection
* ☁️ Secure MongoDB cloud storage
* 🚫 No advertisements
* 🚫 No third-party analytics
* 🔐 Personal diary ID generation
* 💾 Automatic saving

---

## 📊 Productivity

* 🔥 Writing streak counter
* 😊 Mood history
* 📈 Mood graph (Last 7 Days)
* ⏰ Daily writing reminders
* ⌨️ Keyboard shortcut (`Ctrl/Cmd + S`)

---

# 📸 Preview

> Replace these placeholders with screenshots from your project.

```
screenshots/
│
├── onboarding.png
├── dashboard.png
├── dark-mode.png
├── themes.png
└── mobile.png
```

Example:

```md
![Onboarding](screenshots/onboarding.png)

![Dashboard](screenshots/dashboard.png)

![Dark Mode](screenshots/dark-mode.png)
```

---

# 🛠 Tech Stack

| Category            | Technologies                  |
| ------------------- | ----------------------------- |
| **Frontend**        | HTML5, CSS3, JavaScript (ES6) |
| **Backend**         | Node.js, Express.js           |
| **Database**        | MongoDB Atlas, Mongoose       |
| **Deployment**      | Vercel, Render                |
| **Version Control** | Git, GitHub                   |

---

# 🏗 System Architecture

```text
                  User
                    │
                    ▼
         Frontend (Vercel)
                    │
                    ▼
      Express.js Backend (Render)
                    │
                    ▼
        MongoDB Atlas Database
```

Every user receives a unique diary ID during setup.

All entries, moods, themes, tags, and settings are securely stored in MongoDB Atlas, allowing seamless access across devices.

---

# 📂 Project Structure

```text
pastel-diary/
│
├── index.html
├── style.css
├── script.js
├── config.js
├── server.js
├── package.json
├── .env.example
├── .gitignore
├── README.md
│
├── screenshots/
│   ├── onboarding.png
│   ├── dashboard.png
│   ├── dark-mode.png
│   ├── themes.png
│   └── mobile.png
│
└── assets/
```

---

# 🚀 Getting Started

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Shreya-Shukla27/pastel-diary.git

cd pastel-diary
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file in the project root.

```env
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:8080
PORT=3001
```

---

## 4️⃣ Start the Backend

```bash
npm start
```

The backend runs at:

```
http://localhost:3001
```

---

## 5️⃣ Start the Frontend

Use VS Code Live Server

OR

```bash
python -m http.server 8080
```

Visit:

```
http://localhost:8080
```

Make sure `config.js` points to

```javascript
window.BACKEND_URL = "http://localhost:3001";
```

---

# 🌐 Deployment

## 🚀 Frontend (Vercel)

1. Push your project to GitHub.
2. Import the repository into Vercel.
3. Framework Preset → **Other**
4. Deploy.

---

## ⚙ Backend (Render)

Build Command

```bash
npm install
```

Start Command

```bash
node server.js
```

Environment Variables

| Variable       | Description                     |
| -------------- | ------------------------------- |
| `MONGODB_URI`  | MongoDB Atlas connection string |
| `FRONTEND_URL` | Vercel frontend URL             |
| `PORT`         | Server port                     |

---

## ☁ Database (MongoDB Atlas)

* Create a free M0 Cluster
* Create a Database User
* Allow Network Access
* Copy Driver Connection String
* Add it to `.env`

---

# 💡 Tips

* ⌨️ Press **Ctrl/Cmd + S** to save from anywhere.
* ✏️ Click the edit icon beside the date to change journal dates.
* 🏷️ Add tags and press **Enter**.
* 🔍 Filter entries using sidebar tags.
* 🌈 Switch themes anytime.
* 🌙 Enable Dark Mode for comfortable night journaling.

---

# 🔒 Privacy

Pastel Diary is designed with privacy in mind.

* No advertisements
* No tracking
* No analytics
* Secure cloud storage
* Optional PIN protection
* Personal diary ID stored locally

---

# 🚀 Future Enhancements

* 📅 Interactive Calendar View
* 📊 Mood Analytics Dashboard
* 🤖 AI Writing Assistant
* 🎤 Voice Journaling
* 📄 PDF Export
* 🎵 Ambient Writing Sounds
* 🖋 Rich Text Editor
* 📍 Weather & Location Support
* 🔍 Full-text Search
* ❤️ Favorite Entries
* 📱 Progressive Web App (PWA)

---

# 🤝 Contributing

Contributions are always welcome!

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

# ⭐ Support

If you enjoyed this project or found it useful,

**Please consider giving it a ⭐ on GitHub!**

It really helps and motivates future development.

---

# 👩‍💻 Author

**Shreya Shukla**

🎓 B.Tech Computer Science & Engineering (Data Science)

Manipal University Jaipur

🌐 GitHub: https://github.com/Shreya-Shukla27

---

<p align="center">

### 🌸 *Made with pastels, patience, and care.*

*"Every memory deserves a beautiful home."*

</p>

Minor documentation update.
