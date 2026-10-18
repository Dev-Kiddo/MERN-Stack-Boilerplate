# ⚡ MERN Stack Practice Starter Codebase

A clean, modular, and modern **MERN (MongoDB, Express, React, Node.js)** starter codebase crafted specifically for practicing full-stack development.

Featuring an **Express REST API** with **Mongoose** modeling, and a fast **React (Vite)** frontend styled with **Tailwind CSS v4** and modern glassmorphic aesthetics.

---

## 📁 Project Architecture

```
Basic MERN Code/
├── package.json                 # Root script runner (runs client & server together)
├── .gitignore
├── README.md
│
├── server/                      # 🚀 Node.js + Express + MongoDB Backend
│   ├── package.json
│   ├── .env                     # Server environment variables (port, db URI)
│   ├── .env.example
│   └── src/
│       ├── config/
│       │   └── db.js            # Mongoose connection & status checker
│       ├── controllers/
│       │   └── taskController.js # Full CRUD logic, stats, & seed helper
│       ├── middleware/
│       │   └── errorHandler.js   # 404 & global error handling
│       ├── models/
│       │   └── Task.js          # Mongoose Task Schema & validation
│       ├── routes/
│       │   ├── healthRoutes.js  # /api/health endpoint
│       │   └── taskRoutes.js    # /api/tasks endpoints
│       └── server.js            # Express app entry point
│
└── client/                      # ⚛️ React 19 + Vite + Tailwind CSS v4 Frontend
    ├── package.json
    ├── vite.config.js           # Vite config with @tailwindcss/vite & API proxy
    ├── index.html               # Custom fonts & SEO meta tags
    └── src/
        ├── components/
        │   ├── Navbar.jsx       # Real-time backend & MongoDB status indicators
        │   ├── StatsOverview.jsx# Metric cards & completion progress bar
        │   ├── FilterBar.jsx    # Search, category, priority, & status filters
        │   ├── TaskCard.jsx     # Interactive cards with quick-toggle & actions
        │   ├── TaskModal.jsx    # Create & edit task modal
        │   └── ApiGuideModal.jsx# In-app API reference & practice roadmap
        ├── services/
        │   └── api.js           # API communication layer
        ├── App.jsx              # Main dashboard application
        ├── index.css            # Tailwind CSS v4 configuration
        └── main.jsx             # React DOM root
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Dependencies for both client and server are already pre-installed. If you ever need to reinstall everything:
```bash
npm run install:all
```

### 2. Configure MongoDB
By default, the server connects to a local MongoDB instance:
- **Local MongoDB**: `mongodb://127.0.0.1:27017/mern_practice` (ensure `mongod` is running).
- **Free Cloud MongoDB Atlas**:
  1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
  2. Click **Connect** → **Drivers** to copy your connection string.
  3. Open [`server/.env`](file:///d:/Development/Playground/Basic%20MERN%20Code/server/.env) and update:
     ```env
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mern_practice?retryWrites=true&w=majority
     ```

### 3. Run the Full Stack
Start both Express and React with one command from the project root:
```bash
npm run dev
```

Or run them individually in separate terminals:
- **Backend Only**: `npm run dev:server` (runs on `http://localhost:5000`)
- **Frontend Only**: `npm run dev:client` (runs on `http://localhost:5173`)

---

## 📡 REST API Reference

| Method | Endpoint | Description | Sample Query / Payload |
|---|---|---|---|
| `GET` | `/api/health` | Server uptime & MongoDB connection state | — |
| `GET` | `/api/tasks` | Fetch tasks with optional filters | `?search=react&status=pending&priority=high` |
| `GET` | `/api/tasks/:id` | Fetch single task by ObjectId | — |
| `POST` | `/api/tasks` | Create new task | `{"title":"Task Title","priority":"high","category":"Backend"}` |
| `PUT` | `/api/tasks/:id` | Update task details or status | `{"status":"completed"}` |
| `DELETE`| `/api/tasks/:id` | Remove task by ID | — |
| `GET` | `/api/tasks/stats` | Aggregated count statistics | — |
| `POST` | `/api/tasks/seed` | Seed database with demo practice tasks | — |

---

## 🎯 6 Practice Challenges to Master Full-Stack Skills

Use this foundation to practice and level up:

1. **Add a Due Date Picker & Overdue Alert**:
   - Add a date picker to [`TaskModal.jsx`](file:///d:/Development/Playground/Basic%20MERN%20Code/client/src/components/TaskModal.jsx).
   - Display an overdue badge on [`TaskCard.jsx`](file:///d:/Development/Playground/Basic%20MERN%20Code/client/src/components/TaskCard.jsx) when `dueDate < Date.now()` and status is not completed.

2. **Implement User Authentication (JWT)**:
   - Create a `User` model (`name`, `email`, `passwordHash`) in `server/src/models/User.js`.
   - Add register & login routes with `bcrypt` and `jsonwebtoken`.
   - Protect task routes so users only see their own tasks.

3. **Backend Pagination**:
   - Update `getTasks` in [`taskController.js`](file:///d:/Development/Playground/Basic%20MERN%20Code/server/src/controllers/taskController.js) to support `?page=1&limit=6` using Mongoose `.skip()` and `.limit()`.
   - Add page navigation buttons in React.

4. **Kanban Board View**:
   - Add a toggle in the UI between "List View" and "Kanban Board" (columns for Pending, In Progress, Completed).
   - Allow drag-and-drop or column buttons to change task states.

5. **Tags & Multi-Filter**:
   - Allow adding multiple tags (e.g. `['bug', 'v1', 'ui']`) to a task.
   - Filter by clicking tags.

6. **Automated Unit & Integration Tests**:
   - Add tests using Vitest on the frontend and Jest / Supertest on the Express API.
