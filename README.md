# 🚀 Space Duel

**Space Duel** is a browser-based strategic card game inspired by the classic game **Arcomage**.

Instead of castles, players control **planets in space** and use cards to attack opponents, defend themselves, and generate resources.

The main objective is to destroy the opponent's planet before yours is destroyed, or achieve one of the alternative victory conditions.

This project was created as a **full‑stack pet project** to practice browser game development, game logic design, and client–server architecture.

---

# 🎮 Live Demo

Play the game here:

[https://spaceduel2.netlify.app/](https://spaceduel2.netlify.app/)

---

# 🔗 Repositories

Frontend
[https://github.com/Ziata/SpaceDuel](https://github.com/Ziata/SpaceDuel)

Backend
[https://github.com/Ziata/SpaceDuelServer](https://github.com/Ziata/SpaceDuelServer)

---

# 🧠 Game Concept

Two planets battle each other using cards.

Cards can:

* deal damage to the opponent
* restore health and shields of your planet
* increase resource production
* apply special effects

The game is **turn-based**, requiring players to manage resources and choose cards strategically.

### Victory Conditions

A player wins if they:

* destroy the opponent’s planet
* accumulate **150 units of each resource**
* increase their planet size to **100**

---

# ⚠️ Current Limitations

At the current stage some systems are intentionally simplified.

* ❌ **Backend user authentication is not implemented yet**
* 👤 Player identity is temporarily stored in **browser localStorage**
* 🔄 User accounts and persistent player profiles are not implemented yet

This approach allows faster gameplay testing while the core mechanics are still evolving.

---

# ✨ Features

* 🃏 turn-based card gameplay
* 🌍 planet vs planet combat
* ⚡ resource management system
* 🎲 random card generation
* 🌐 fully playable in the browser
* 🔄 frontend–backend interaction

---

# 🏗 Project Architecture

The project consists of **two independent applications**.

```
space-duel
│
├── frontend   https://github.com/Ziata/SpaceDuel
│
└── backend    https://github.com/Ziata/SpaceDuelServer
```

### Frontend Responsibilities

* rendering the game interface
* handling player input
* displaying the game state
* storing temporary player data (localStorage)

### Backend Responsibilities

* managing the game state
* validating turns
* processing card effects
* implementing game logic
* providing API communication

---

# 🛠 Tech Stack

## Frontend

* JavaScript
* HTML5
* CSS
* Vue
* Pinia

## Backend

* Node.js
* NestJS
* MongoDB
* WebSocket / REST API

## Deployment

* Frontend: Netlify
* Backend: Render

---

# ⚙️ Local Development

## 1. Clone the repositories

Frontend

```
git clone https://github.com/Ziata/SpaceDuel
```

Backend

```
git clone https://github.com/Ziata/SpaceDuelServer
```

---

## 2. Install dependencies

Frontend

```
pnpm install
```

Backend

```
pnpm install
```

---

## 3. Start development servers

Frontend

```
pnpm run dev
```

Backend

```
pnpm run start
```

---

## Default Ports

```
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

---

# 🎯 Game Mechanics

Core mechanics implemented in the game:

* turn-based gameplay loop
* resource system
* card effect processing
* damage and defense mechanics
* planet health and shield system

### Example Game Flow

1. the player receives cards
2. the player selects a card and spends resources
3. the server processes the card effect
4. the turn passes to the next player

---

# 🚧 Roadmap

Planned improvements:

* 📱 responsive mobile layout
* ✨ card animations
* 👀 spectator mode (watch battles between other players)
* 🔐 full backend authentication system
* 🧑‍🤝‍🧑 player accounts
* 🧪 automated tests
* 🎵 sound effects
* 🎮 UI improvements

---

# 📸 Screenshots

![Gameplay](https://spaceduel2.netlify.app/screenshots/1.png)
![Battle](https://spaceduel2.netlify.app/screenshots/2.png)

---

# 🧪 Purpose of the Project

This project was created to practice:

* full‑stack development
* client–server architecture
* browser game development
* game logic implementation
* turn-based gameplay systems

---

# 👨‍💻 Author

Developed by **Ruslan Havryliuk**

GitHub:
[https://github.com/Ziata](https://github.com/Ziata)

This project was created as a personal learning project to explore browser game development and full‑stack architecture.
