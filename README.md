# ⚡ MERN Stack Practice Starter Codebase (TypeScript)

A clean, modular, and type-safe **MERN (MongoDB, Express, React, Node.js)** starter codebase crafted specifically for practicing full-stack development with **TypeScript**.

Featuring an **Express REST API** with **TypeScript + Mongoose** modeling, and a fast **React 19 + TypeScript (Vite)** frontend styled with **Tailwind CSS v4** and modern glassmorphic aesthetics.

---

## 📁 Project Architecture

```
MERN Stack Boilerplate/
├── package.json                 # Root script runner (runs TS client & server concurrently)
├── .gitignore
├── README.md
│
├── server/                      # 🚀 Node.js + Express + MongoDB Backend (TypeScript)
│   ├── package.json
│   ├── tsconfig.json            # NodeNext ES2022 TypeScript configuration
│   ├── .env                     # Server environment variables (port, db URI)
│   ├── .env.example
│   └── src/
│       ├── config/
│       │   └── db.ts            # Mongoose connection & typed status helper
│       ├── controllers/
│       │   └── taskController.ts # Typed CRUD logic, stats, & seed helper
│       ├── middleware/
│       │   └── errorHandler.ts  # Typed 404 & global error handling
│       ├── models/
│       │   └── Task.ts          # ITask interface & Mongoose Schema
│       ├── routes/
│       │   ├── healthRoutes.ts  # /api/health endpoint
│       │   └── taskRoutes.ts    # /api/tasks endpoints
│       └── server.ts            # Express app entry point
│
└── client/                      # ⚛️ React 19 + Vite + Tailwind CSS v4 Frontend (TypeScript)
    ├── package.json
    ├── tsconfig.json            # Vite React TypeScript configuration
    ├── vite.config.ts           # Configured with @tailwindcss/vite & API proxy
    ├── index.html               # Custom fonts & SEO meta tags
    └── src/
        ├── types/
        │   └── task.ts          # Centralized TypeScript interfaces (Task, Stats, Health)
        ├── components/
        │   ├── Navbar.tsx       # Real-time backend & MongoDB status indicators
        │   ├── StatsOverview.tsx# Metric cards & completion progress bar
        │   ├── FilterBar.tsx    # Search, category, priority, & status filters
        │   ├── TaskCard.tsx     # Interactive cards with quick-toggle & actions
        │   ├── TaskModal.tsx    # Typed create & edit task modal
        │   └── ApiGuideModal.tsx# In-app API reference & practice roadmap
        ├── services/
        │   └── api.ts           # Typed API communication layer
        ├── App.tsx              # Main dashboard application
        ├── index.css            # Tailwind CSS v4 styles & custom scrollbars
        ├── main.tsx             # React DOM root
        └── vite-env.d.ts        # Vite client types
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
Start both Express (TypeScript via `tsx watch`) and React (TypeScript via Vite) with one command from the project root:
```bash
npm run dev
```

Or run them individually in separate terminals:
- **Backend Only (TS)**: `npm run dev:server` (runs on `http://localhost:5000`)
- **Frontend Only (TS)**: `npm run dev:client` (runs on `http://localhost:5173`)

### 4. Build for Production
To typecheck and compile both backend and frontend:
```bash
npm run build
```
- Server outputs compiled JS to `server/dist/`
- Client outputs production bundle to `client/dist/`

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

## 🎯 6 TypeScript Practice Challenges to Master Full-Stack Skills

Use this typed foundation to practice and level up:

1. **Add a Due Date Picker & Overdue Alert**:
   - Add a date input to [`TaskModal.tsx`](file:///d:/Development/Playground/Basic%20MERN%20Code/client/src/components/TaskModal.tsx).
   - Display an overdue badge on [`TaskCard.tsx`](file:///d:/Development/Playground/Basic%20MERN%20Code/client/src/components/TaskCard.tsx) when `dueDate < Date.now()` and status is not completed.

2. **Implement User Authentication (JWT + TypeScript)**:
   - Create a typed `User` model (`IUser` interface) in `server/src/models/User.ts`.
   - Add register & login routes with `bcrypt` and `jsonwebtoken`.
   - Create typed Express request middleware to attach `req.user`.

3. **Backend Pagination**:
   - Update `getTasks` in [`taskController.ts`](file:///d:/Development/Playground/Basic%20MERN%20Code/server/src/controllers/taskController.ts) to support `?page=1&limit=6` using Mongoose `.skip()` and `.limit()`.
   - Add page navigation buttons in React.

4. **Kanban Board View**:
   - Add a toggle in the UI between "List View" and "Kanban Board" (columns for Pending, In Progress, Completed).
   - Allow drag-and-drop or column buttons to change task states.

5. **Tags & Multi-Filter**:
   - Update `ITask` interface and schema to include `tags: string[]`.
   - Filter by clicking tags in React.

6. **Automated Unit & Integration Tests**:
   - Add tests using Vitest on the frontend and Jest / Supertest on the Express API.
