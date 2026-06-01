# Architecture and Design Document

## System Overview
Mini OMS is a full-stack monorepo application built with modern web technologies for managing products and orders.

---

## Technology Stack

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3
- **Language:** JavaScript (ES Modules)

### Backend
- **Framework:** Express 5
- **Runtime:** Node.js 24+
- **Language:** JavaScript (ES Modules)

### Development
- **Monorepo:** npm workspaces
- **Concurrent Execution:** concurrently

### Data Storage
- **Current:** JSON files (file-based)
- **Future:** PostgreSQL or MongoDB

---

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│           Browser (Client)              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     Frontend (React 19 + Vite)          │
│     Port: 5173                          │
│     - UI Components                     │
│     - State Management                  │
│     - API Client                        │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
               ▼
┌─────────────────────────────────────────┐
│     Backend (Express 5)                 │
│     Port: 3000                          │
│     - API Routes                        │
│     - Business Logic                    │
│     - Data Access Layer                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     Data Storage (JSON Files)           │
│     - products.json                     │
│     - orders.json                       │
└─────────────────────────────────────────┘
```

---

## Project Structure

```
mini_oms/
├── apps/
│   ├── frontend/          # React application
│   │   ├── src/
│   │   │   ├── main.jsx   # Entry point
│   │   │   ├── App.jsx    # Root component
│   │   │   └── index.css  # Global styles
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   └── package.json
│   │
│   └── backend/           # Express API
│       ├── src/
│       │   └── server.js  # Server entry point
│       └── package.json
│
├── data/                  # JSON storage
│   ├── products.json
│   └── orders.json
│
├── docs/                  # Documentation
│   ├── plan.md
│   ├── design.md
│   └── prompts.md
│
└── package.json           # Root workspace config
```

---

## Data Models

### Product
```javascript
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string",
  "price": "number",
  "quantity": "number",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

### Order
```javascript
{
  "id": "string (UUID)",
  "customerName": "string",
  "items": [
    {
      "productId": "string",
      "quantity": "number",
      "price": "number"
    }
  ],
  "totalAmount": "number",
  "status": "string (pending|completed|cancelled)",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

---

## API Design

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get product by ID |
| POST | /api/products | Create new product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/orders | Get all orders |
| GET | /api/orders/:id | Get order by ID |
| POST | /api/orders | Create new order |
| PUT | /api/orders/:id | Update order |
| DELETE | /api/orders/:id | Delete order |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Server health check |

---

## Frontend Architecture

### Component Structure (Planned)
```
src/
├── components/
│   ├── products/
│   │   ├── ProductList.jsx
│   │   ├── ProductForm.jsx
│   │   └── ProductItem.jsx
│   │
│   └── orders/
│       ├── OrderList.jsx
│       ├── OrderForm.jsx
│       └── OrderItem.jsx
│
├── services/
│   └── api.js          # API client
│
├── App.jsx
└── main.jsx
```

### State Management
- Start with React useState/useEffect
- Consider Zustand or Redux if complexity grows

---

## Backend Architecture

### Folder Structure (Planned)
```
src/
├── routes/
│   ├── products.js
│   └── orders.js
│
├── controllers/
│   ├── productController.js
│   └── orderController.js
│
├── services/
│   ├── productService.js
│   └── orderService.js
│
├── utils/
│   ├── fileStorage.js
│   └── validation.js
│
└── server.js
```

### Middleware Stack
1. CORS
2. JSON body parser
3. Route handlers
4. Error handler

---

## Development Workflow

### Local Development
1. Run `npm install` to install dependencies
2. Run `npm run dev:concurrent` to start both servers
3. Frontend: http://localhost:5173
4. Backend: http://localhost:3000

### API Proxy
- Vite dev server proxies `/api` requests to backend
- No CORS issues during development

### Hot Reload
- Frontend: Vite HMR (instant updates)
- Backend: Node.js --watch flag (auto-restart)

---

## Security Considerations

### Current (Development)
- CORS enabled for all origins
- No authentication
- No input sanitization
- File-based storage

### Future (Production)
- [ ] Implement JWT authentication
- [ ] Add input validation and sanitization
- [ ] Implement rate limiting
- [ ] Add security headers (Helmet.js)
- [ ] Use environment variables for config
- [ ] Migrate to secure database
- [ ] Implement HTTPS

---

## Performance Considerations

### Frontend
- Code splitting (future)
- Lazy loading (future)
- Memoization for expensive components
- Tailwind CSS purging in production

### Backend
- Async/await for I/O operations
- Connection pooling (when using database)
- Caching layer (future)
- Pagination for large datasets

---

## Scalability Path

### Phase 1: Current
- File-based JSON storage
- Single server instance
- Development mode

### Phase 2: Database Migration
- PostgreSQL or MongoDB
- Connection pooling
- Proper indexing

### Phase 3: Production Ready
- Environment-based configuration
- Logging and monitoring
- Error tracking
- Load balancing

### Phase 4: Microservices (Optional)
- Separate product and order services
- API Gateway
- Message queue for async operations

---

## Testing Strategy

### Unit Tests
- Test individual functions
- Test React components
- Test API endpoints

### Integration Tests
- Test API workflows
- Test frontend-backend integration

### E2E Tests
- Test complete user flows
- Use Playwright or Cypress

---

## Deployment Strategy

### Frontend
- Build: `npm run build:frontend`
- Output: `apps/frontend/dist/`
- Deploy to: Vercel, Netlify, or CDN

### Backend
- Run: `npm start -w backend`
- Deploy to: AWS, GCP, Azure, or Heroku
- Use PM2 for process management

---

## Future Enhancements

### Features
- User authentication and authorization
- Role-based access control
- Email notifications
- PDF invoice generation
- Analytics dashboard
- Export to CSV/Excel

### Technical
- TypeScript migration
- GraphQL API (alternative to REST)
- WebSocket for real-time updates
- Docker containerization
- Kubernetes orchestration
- CI/CD pipeline

---

## Notes
- This is a living document
- Update as architecture evolves
- Document major design decisions
