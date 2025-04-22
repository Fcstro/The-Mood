# The-Mood

## Overview

**The-Mood** is a full-stack social media platform that connects users through shared emotional experiences. It enables individuals to express their moods, interact with others, and foster a supportive online community. The project is composed of two core components:

- **The-Mood API** – a RESTful API built with Node.js.
- **The-Mood SPA** – an interactive Single Page Application (SPA) built with native JavaScript, HTML, and CSS.

---

## Features

- **Mood Sharing** – Post and share your current mood with customizable emoji reactions.
- **Community Interaction** – Like, comment, follow other users, and engage in mood-based discussions.
- **Personalized Feed** – Curated content based on your connections, interests, and emotional patterns.
- **User Profiles** – Customize and manage your personal profile with mood history tracking.
- **Real-time Updates** – Instant notifications for interactions and new content.
- **Privacy Controls** – Manage who can see and interact with your moods.

---

## Technologies Used

### Backend – The-Mood API

- **Node.js** – JavaScript runtime environment.
- **Express.js** – Lightweight web framework for Node.js.
- **MySQL** – Relational database system.
- **JWT** – User authentication and authorization.
- **Socket.io** – Real-time communication.
- **bcrypt** – Password hashing.

### Frontend – The-Mood SPA

- **HTML5** – Semantic markup structure.
- **CSS3** – Modern styling with Flexbox and Grid.
- **JavaScript (ES6+)** – Frontend interactivity.
- **LocalStorage** – Client-side data persistence.
- **Fetch API** – RESTful API communication.

---

## Project Structure

```
The-Mood/
├── The_Mood-API/               # Backend API
│   ├── controllers/            # Request handlers
│   ├── core/                   # Core logic and services
│   ├── middlewares/            # Middleware functions
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── utils/                  # Utility functions
│   ├── index.js                # API entry point
│   ├── package.json            # API dependencies
│   ├── mocked_up_data.md       # Sample mock data
│   ├── the_mood_db.sql         # SQL schema
│   └── README.md               # API documentation
│
├── The_Mood-SPA/               # Frontend SPA
│   ├── src/                    # SPA core source
│   │   ├── index.html          # Main HTML file
│   │   ├── index.js            # Entry JavaScript file
│   │   ├── main.js             # Main application logic
│   │   ├── components/         # Reusable UI components
│   │   ├── controllers/        # Application controllers
│   │   ├── models/             # Data models
│   │   ├── routes/             # Frontend routing
│   │   ├── styles/             # CSS styles
│   │   ├── utils/              # Utility functions
│   │   └── layouts/            # Layout templates
│   ├── public/                 # Public assets
│   ├── package.json            # SPA dependencies
│   ├── mocked_up_data.md       # Sample mock data
│   ├── the_mood_db.sql         # SQL schema
│   └── README.md               # SPA documentation
│
└── README.md                   # Main README
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
    - Use a local server like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code.
    - Or run a static file server (e.g., `npx serve`).

---

## Developed By

- **Castro, Fredderico**
- **Concepcion, Paul Dexter**
- **Caincoy, Cristian**
- **Alvarez, John Dexter**
- **Chica, Ralp Clarence**

