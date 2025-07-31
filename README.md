<p align="center">
  <img src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg" width="300" alt="YouTube Logo" />
</p>
<h1 align="center">
  
  Youtube Clone - MERN Stack
  <img src="https://img.shields.io/badge/status-in--development-yellow" />
</h1>

This is a full-stack YouTube Clone project built using the MERN stack (MongoDB, Express.js, React, Node.js).\
Frontend is built with **Vite + Tailwind CSS + React Router**, and the backend is powered by **Express + MongoDB**.

---

## Project Status

This project is currently **in development**.  
Core features like User Authentication (JWT), Comments System, Like / Dislike, Search & Filter Videos etc are being actively built.
Stay tuned for updates and new releases.

---

## Project Structure

```
youtube-clone/
├── client/         # Frontend
├── server/         # Backend
├── .gitignore
├── README.md
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/SravanGunaganti/youtube-clone.git
cd youtube-clone
```

---

## Frontend (`client`)

### Install Dependencies

```bash
cd client
npm install
```

### Start Dev Server

```bash
npm run dev
```

### Frontend Environment (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Backend (`server`)

### Install Dependencies

```bash
cd server
npm install
```

### Start Server

```bash
npm run dev
```

### Backend Environment (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/youtube_clone
JWT_SECRET=your_jwt_secret
```

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- jwt-decode

### Backend

- Express.js
- Mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors

---

## Useful Commands

| Command       | Location | Description          |
| ------------- | -------- | -------------------- |
| `npm install` | both     | Install dependencies |
| `npm run dev` | both     | Start dev server     |

---

## Notes

- MongoDB must be running locally, or you can configure a MongoDB Atlas URI.
- `.env` files are added to `.gitignore` and must be created manually.

---

## Author

Made by **Sravan Gunaganti**
