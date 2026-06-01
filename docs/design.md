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
│       │   ├── routes/           # Route definitions
│       │   ├── controllers/      # Request handlers
│       │   ├── services/         # Business logic
│       │   ├── middleware/       # Custom middleware
│       │   ├── utils/            # Utility functions
│       │   ├── database/         # Data access layer
│       │   └── server.js         # Server entry point
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

### Folder Structure (Implemented)
```
src/
├── routes/              # Route definitions
│   ├── index.js         # Main router (aggregates all routes)
│   └── health.routes.js # Health check routes
│
├── controllers/         # Request handlers
│   └── health.controller.js
│
├── services/            # Business logic layer
│   └── health.service.js
│
├── middleware/          # Custom middleware
│   ├── errorHandler.js  # Global error handler
│   ├── notFound.js      # 404 handler
│   └── logger.js        # Request logger
│
├── utils/               # Utility functions
│   ├── asyncHandler.js  # Async error wrapper
│   └── AppError.js      # Custom error class
│
├── database/            # Data access layer
│   └── fileStorage.js   # JSON file read/write helpers
│
└── server.js            # Application entry point
```

### Layer Responsibilities

#### 1. Routes Layer (`routes/`)
**Responsibility:** Define API endpoints and map them to controllers
- Register HTTP methods (GET, POST, PUT, DELETE)
- Group related endpoints
- Apply route-specific middleware
- **Example:** `GET /api/health` → `health.controller.js`

#### 2. Controllers Layer (`controllers/`)
**Responsibility:** Handle HTTP requests and responses
- Extract data from request (params, query, body)
- Call appropriate service methods
- Format and send responses
- Handle errors with try-catch
- **Example:** `getHealthStatus()` extracts nothing, calls service, returns JSON

#### 3. Services Layer (`services/`)
**Responsibility:** Contain business logic
- Implement core application logic
- Perform data validation
- Orchestrate database operations
- Return data or throw errors
- **Example:** `checkHealth()` returns system status object

#### 4. Middleware Layer (`middleware/`)
**Responsibility:** Process requests before/after route handlers
- **logger.js:** Log incoming requests
- **errorHandler.js:** Catch and format errors
- **notFound.js:** Handle 404 errors
- Applied globally or per-route

#### 5. Utils Layer (`utils/`)
**Responsibility:** Provide reusable helper functions
- **asyncHandler.js:** Wrap async functions to catch errors
- **AppError.js:** Custom error class with status codes
- Pure functions with no side effects

#### 6. Database Layer (`database/`)
**Responsibility:** Abstract data storage operations
- **fileStorage.js:** Read/write JSON files
- Provides `readData()` and `writeData()` methods
- Handles file system errors
- Future: Replace with database ORM

### Request Flow

```
1. Client Request
   ↓
2. Express App (server.js)
   ↓
3. Middleware Stack
   ├── CORS
   ├── JSON Parser
   └── Request Logger
   ↓
4. Routes Layer (routes/index.js)
   ├── Match URL pattern
   └── Route to specific handler
   ↓
5. Controller Layer (controllers/*.controller.js)
   ├── Extract request data
   ├── Validate input (basic)
   └── Call service method
   ↓
6. Service Layer (services/*.service.js)
   ├── Execute business logic
   ├── Call database layer if needed
   └── Return data or throw error
   ↓
7. Database Layer (database/fileStorage.js)
   ├── Read/write JSON files
   └── Return data
   ↓
8. Response Flow (back up the chain)
   ├── Service returns data to controller
   ├── Controller formats response
   └── Send JSON response to client
   ↓
9. Error Handling (if error occurs)
   ├── Error caught by asyncHandler or try-catch
   ├── Passed to errorHandler middleware
   └── Formatted error response sent to client
```

### Middleware Stack (Execution Order)
1. **CORS** - Enable cross-origin requests
2. **JSON Parser** - Parse request body
3. **Request Logger** - Log incoming requests
4. **Routes** - Match and execute route handlers
5. **Not Found** - Catch unmatched routes (404)
6. **Error Handler** - Catch and format all errors

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
