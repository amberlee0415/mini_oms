# Mini OMS (Order Management System)

A modern monorepo-based Order Management System built with React 19 and Express.

## 🏗️ Project Structure

```
mini_oms/
├── apps/
│   ├── frontend/          # React 19 + Vite + Tailwind CSS
│   └── backend/           # Express API server
├── data/                  # JSON-based data storage
│   ├── products.json
│   └── orders.json
├── docs/                  # Documentation
│   ├── plan.md           # Implementation roadmap
│   ├── design.md         # Architecture and design
│   └── prompts.md        # AI prompts log
├── .gitignore
├── package.json           # Root workspace configuration
└── README.md
```

## 🚀 Tech Stack

### Frontend
- **React 19** - Latest React with modern features
- **Vite 6** - Lightning-fast build tool
- **Tailwind CSS 3** - Utility-first CSS framework
- **ESLint 9** - Code linting with flat config

### Backend
- **Express 5** - Fast, unopinionated web framework
- **Node.js 24+** - JavaScript runtime with native watch mode
- **CORS** - Cross-Origin Resource Sharing support

### Development
- **npm workspaces** - Monorepo management
- **concurrently** - Run multiple dev servers simultaneously

## 📋 Prerequisites

- Node.js >= 24.0.0
- npm >= 10.0.0

## 🛠️ Installation

```bash
# Install all dependencies
npm install
```

This will install dependencies for the root workspace and all apps (frontend + backend).

## 🏃 Development

### Run both frontend and backend concurrently:
```bash
npm run dev:concurrent
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Run frontend only:
```bash
npm run dev:frontend
```

### Run backend only:
```bash
npm run dev:backend
```

## 📦 Build

### Build all apps:
```bash
npm run build
```

### Build specific app:
```bash
npm run build:frontend
npm run build:backend
```

## 🔧 Configuration

### Frontend Configuration
- **Vite config:** `apps/frontend/vite.config.js`
- **Tailwind config:** `apps/frontend/tailwind.config.js`
- **ESLint config:** `apps/frontend/eslint.config.js`

### Backend Configuration
- **Server entry:** `apps/backend/src/server.js`
- **Port:** 3000 (configurable via PORT environment variable)

### API Proxy
The frontend Vite dev server is configured to proxy `/api` requests to the backend at `http://localhost:3000`.

## 📁 Data Storage

JSON files in the `data/` directory serve as simple file-based storage:
- `products.json` - Product data
- `orders.json` - Order data

## 📚 Documentation

- **`docs/plan.md`** - Implementation roadmap with phases and tasks
- **`docs/design.md`** - Architecture, data models, and API design
- **`docs/prompts.md`** - Log of AI prompts used during development

## 🎯 Next Steps

1. Implement product management features (CRUD)
2. Implement order management features (CRUD)
3. Add routing (React Router)
4. Add state management (if needed)
5. Add form validation
6. Add authentication (optional)
7. Migrate to a real database (PostgreSQL, MongoDB, etc.)

## 📝 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev:concurrent` | Run frontend + backend together |
| `npm run dev:frontend` | Run frontend only |
| `npm run dev:backend` | Run backend only |
| `npm run build` | Build all apps |
| `npm run build:frontend` | Build frontend only |
| `npm run build:backend` | Build backend only |
| `npm run clean` | Clean all workspaces |
| `npm run lint` | Lint all workspaces |

## 🤝 Contributing

This is a learning/demo project. Feel free to extend it as needed.

## 📄 License

MIT
