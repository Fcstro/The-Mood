gi

# The-Mood

## Overview

**The-Mood** is a full-stack social media platform that connects users through shared emotional experiences. It enables individuals to express their moods, interact with others, and foster a supportive online community. The project is composed of two core components:

- **The-Mood API** – a RESTful API built with Node.js.
- **The-Mood SPA** – an interactive Single Page Application (SPA) built with native JavaScript, HTML, and CSS.

---

## Features

- **Mood Sharing** – Post and share your current mood.
- **Community Interaction** – Like, comment, and follow other users.
- **Personalized Feed** – Curated content based on your connections and interests.
- **User Profiles** – Customize and manage your personal profile.

---

## Technologies Used

### Backend – The-Mood API

- **Node.js** – JavaScript runtime environment.
- **Express.js** – Lightweight web framework for Node.js.
- **MySQL** – Relational database system.

### Frontend – The-Mood SPA

- **HTML** – Markup language for structure.
- **CSS** – Styling for web pages.
- **JavaScript** – Adds interactivity to the frontend.

---

## Project Structure

```
The-Mood/
├── The_Mood-API/               # Backend API
│   ├── controllers/            # Request handlers
│   ├── core/                   # Core logic and services
│   ├── middlewares/           # Middleware functions
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── utils/                  # Utility functions
│   ├── index.js                # API entry point
│   ├── package.json            # API dependencies
│   ├── mocked_up_data.md       # Sample mock data
│   ├── the_mood_db.sql         # SQL schema
│   └── README.md               # API documentation
│
├── The_Mood-SPA/              # Frontend SPA
│   ├── explore/               # Explore page
│   │   ├── explore.html
│   │   ├── explore.css
│   │   └── navigation.js
│   ├── follower/              # Follower page
│   │   ├── followers.html
│   │   ├── style.css
│   │   └── navigation.js
│   ├── homepage/              # Homepage
│   │   ├── homepage.html
│   │   ├── homepage.css
│   │   └── navigation.js
│   ├── auth/                  # Login, signup, password recovery
│   │   ├── login.html
│   │   ├── signup.html
│   │   ├── forgot-password.html
│   │   └── assets/
│   │       ├── cld.png
│   │       └── cld1.png
│   ├── profile/               # Profile page
│   ├── settings/              # Settings page
│   ├── public/                # Public assets
│   ├── src/                   # SPA core source
│   └── README.md              # SPA documentation
│
└── README.md                  # Main README
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

### Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```

2. Navigate to the API directory:
    ```bash
    cd The-Mood/The_Mood-API
    ```

3. Install API dependencies:
    ```bash
    npm install
    ```

4. Navigate to the SPA directory:
    ```bash
    cd ../The_Mood-SPA
    ```

5. Install SPA dependencies:
    ```bash
    npm install
    ```

### Running the Project

1. Start the API server:
    ```bash
    cd The-Mood/The_Mood-API
    npm start
    ```

2. Open `The_Mood-SPA` in a browser:
    - You can use a local server like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code.
    - Or run a static file server (e.g., `npx serve`).

---

## Developed By

- **Castro, Fredderico**
- **Concepcion, Paul Dexter**
- **Caincoy, Cristian**
- **Alvarez, John Dexter**
- **Chica, Ralp Clarence**

