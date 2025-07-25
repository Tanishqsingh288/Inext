# 📝 MERN Task Management System

This is a full-stack **Task Management Application** built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). The application supports:

- 🔐 User Registration & Login
- 👥 Display list of all registered users
- ✅ Task Management with full CRUD
- ⏱️ Time tracking per task (start/stop timer)
- 📊 Reporting: task count, time spent, and daily/project summaries
- 📦 Docker support for platform-independent deployment

---

## 🚀 Tech Stack

### 📌 Frontend:
- **React.js** (via Create React App)
- **Axios** (for HTTP requests)
- **React Router DOM** (for navigation)

### 🧠 Backend:
- **Node.js** + **Express.js** (REST API)
- **MongoDB** + **Mongoose** (Database & ODM)
- **bcryptjs** (Password hashing)
- **jsonwebtoken (JWT)** (Authentication)
- **multer** (File uploads – photo)
- **dotenv** (Environment config)

### 📦 DevOps:
- **Docker** (for containerization)
- **Docker Compose** (for multi-service orchestration)

---

## 🏗️ Project Architecture

project-root/
├── backend/
│ ├── controllers/ # API logic (auth, tasks)
│ ├── models/ # Mongoose schemas (User, Task)
│ ├── routes/ # Express routes (authRoutes, taskRoutes)
│ ├── middleware/ # JWT, error handling, validation
│ ├── uploads/ # Uploaded user profile photos
│ ├── server.js # Express server entry
│ └── .env # Secrets (Mongo URI, JWT secret)
├── frontend/
│ ├── public/
│ └── src/
│ ├── components/ # UI components
│ ├── pages/ # Page components (Register, Login, Home, Task)
│ ├── App.js # Main app routing
│ └── index.js # Entry point
├── docker-compose.yml # Combined services
├── Dockerfile # Frontend/Backend Docker setup
├── README.md


---

## 🛠️ Setup Instructions (Local)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/inext.git
cd inext


