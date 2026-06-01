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

### Product Endpoints (Implemented ✅)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | /api/products | Get all products | - | `{ status, data: [...] }` |
| GET | /api/products/:id | Get product by ID | - | `{ status, data: {...} }` |
| POST | /api/products | Create new product | `{ name, description, price }` | `{ status, data: {...} }` |
| PUT | /api/products/:id | Update product | `{ name?, description?, price? }` | `{ status, data: {...} }` |
| DELETE | /api/products/:id | Delete product | - | `{ status, message }` |

**Product Data Structure:**
```javascript
{
  id: "uuid",              // Auto-generated
  name: "string",          // Required, non-empty
  description: "string",   // Optional
  price: number,           // Required, > 0
  createdAt: "ISO 8601",   // Auto-generated
  updatedAt: "ISO 8601"    // Auto-updated
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `price`: Required, must be number > 0
- `description`: Optional, defaults to empty string

**Error Responses:**
```javascript
{
  status: "error",
  statusCode: 400|404|500,
  message: "Error description"
}
```

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

## Frontend Architecture (Implemented)

### Folder Structure
```
src/
├── pages/                  # Route-level components
│   ├── ProductsPage.jsx    # /products route
│   └── OrdersPage.jsx      # /orders route
│
├── layouts/                # Shared UI structure
│   └── MainLayout.jsx      # Main layout with navigation
│
├── components/             # Reusable UI components
│   └── .gitkeep            # (Future: ProductList, ProductForm, etc.)
│
├── hooks/                  # Custom React hooks
│   └── .gitkeep            # (Future: useProducts, useOrders, etc.)
│
├── services/               # API communication layer
│   └── api.js              # API client (productApi, orderApi)
│
├── utils/                  # Pure helper functions
│   └── .gitkeep            # (Future: formatters, validators, etc.)
│
├── App.jsx                 # Root component with routing
├── main.jsx                # Application entry point
└── index.css               # Global styles (Tailwind)
```

### Folder Responsibilities

#### **pages/** - Route-Level Components
**Purpose:** Components that represent entire pages/routes
- Each file corresponds to a route
- Contains page-level logic and layout
- Composes smaller components
- **No reusable UI logic** - page-specific only

**Current Files:**
- `ProductsPage.jsx` - Product management page (placeholder)
- `OrdersPage.jsx` - Order management page (placeholder)

#### **layouts/** - Shared UI Structure
**Purpose:** Wrapper components that provide consistent UI structure
- Navigation bars, sidebars, footers
- Wraps page content
- Provides consistent layout across routes

**Current Files:**
- `MainLayout.jsx` - Main application layout with:
  - Top navigation bar with logo
  - Navigation links (Product Management, Order Management)
  - Content area using React Router's `<Outlet />`

#### **components/** - Reusable UI Components
**Purpose:** Small, reusable UI components
- Pure presentational components
- Reusable across multiple pages
- **No business logic** - only UI rendering
- **No API calls** - receives data via props

**Future Examples:**
- `ProductList.jsx` - Display list of products
- `ProductForm.jsx` - Form for create/edit product
- `Button.jsx`, `Modal.jsx`, `Card.jsx` - Generic UI components

#### **hooks/** - Custom React Hooks
**Purpose:** Reusable logic hooks
- Extract and share stateful logic
- **No UI rendering** - logic only
- Follow React hooks rules

**Future Examples:**
- `useProducts.js` - Fetch and manage products state
- `useOrders.js` - Fetch and manage orders state
- `useForm.js` - Form state management

#### **services/** - API Communication
**Purpose:** Abstract API calls from components
- All HTTP requests centralized here
- **No UI logic** - pure data fetching
- Returns promises with data

**Current Files:**
- `api.js` - API client with:
  - `apiRequest()` - Generic fetch wrapper
  - `productApi` - Product CRUD methods
  - `orderApi` - Order CRUD methods

#### **utils/** - Pure Helper Functions
**Purpose:** Utility functions with no side effects
- Data formatting, validation, calculations
- **No state** - pure functions
- **No API calls** - pure transformations

**Future Examples:**
- `formatDate.js` - Date formatting utilities
- `validators.js` - Input validation functions
- `currency.js` - Price formatting

### Routing Structure

**React Router v7 Configuration:**
```javascript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Navigate to="/products" />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="orders" element={<OrdersPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**Route Hierarchy:**
- `/` - Root redirects to `/products`
- `/products` - Product management page
- `/orders` - Order management page

**All routes wrapped by `MainLayout`** which provides:
- Consistent navigation
- Shared UI structure

### Routing Flow

```
1. User navigates to URL
   Example: http://localhost:5173/products
   ↓

2. BrowserRouter matches route
   Match: /products
   ↓

3. Renders MainLayout
   <MainLayout />
   ├── Navigation bar (always visible)
   └── <Outlet /> (placeholder for child route)
   ↓

4. Renders matched page component
   <ProductsPage /> rendered in <Outlet />
   ↓

5. Page renders content
   Product management UI displayed
```

### Navigation Flow

```
User clicks "Order Management" link
   ↓
React Router intercepts click
   ↓
Updates URL to /orders (no page reload)
   ↓
MainLayout stays mounted (navigation persists)
   ↓
<Outlet /> content changes
   ↓
OrdersPage replaces ProductsPage
   ↓
Smooth transition (no full page reload)
```

### API Service Layer

**Purpose:** Centralize all API communication

**Structure:**
```javascript
// Generic request handler
apiRequest(endpoint, options)

// Product API methods
productApi.getAll()
productApi.getById(id)
productApi.create(data)
productApi.update(id, data)
productApi.delete(id)

// Order API methods
orderApi.getAll()
orderApi.getById(id)
orderApi.create(data)
orderApi.update(id, data)
orderApi.delete(id)
```

**Usage in Components:**
```javascript
import { productApi } from '../services/api';

// In component
const products = await productApi.getAll();
```

### State Management
- **Current:** React useState/useEffect
- **Future:** Consider Zustand or Redux if complexity grows

### Design Principles

1. **Separation of Concerns**
   - Pages: Route-level components
   - Layouts: UI structure
   - Components: Reusable UI
   - Services: API calls
   - Hooks: Reusable logic
   - Utils: Pure functions

2. **Single Responsibility**
   - Each folder has one clear purpose
   - Easy to locate code
   - Easy to maintain

3. **Scalability**
   - Clear structure for adding features
   - Reusable components and hooks
   - Centralized API layer

4. **Consistency**
   - All API calls go through services
   - All routes use same layout
   - All pages follow same pattern

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
- **fileStorage.js:** JSON file-based persistence with robust error handling

**Core Functions:**
- `readJson(filename)` - Read and parse JSON files safely
- `writeJson(filename, data)` - Write data to JSON files safely
- `readData()` / `writeData()` - Legacy aliases for backward compatibility

**Error Handling Strategy:**
- **File not found:** Returns empty array `[]` (expected for new files)
- **Empty file:** Returns empty array `[]` with warning
- **Invalid JSON:** Returns empty array `[]` and logs error (prevents crash)
- **Corrupted data:** Returns empty array `[]` (graceful degradation)
- **Write errors:** Returns `false` and logs error (non-blocking)

**Safety Features:**
- Never crashes the server on file errors
- Always returns valid data structure (array)
- Comprehensive logging for debugging
- Validates data before writing

**Usage Pattern:**
```javascript
// In services layer
const products = await readJson('products.json');  // Always returns array
const success = await writeJson('products.json', updatedProducts);  // Returns boolean
```

**Future Migration:**
- Current: JSON files in `data/` directory
- Future: Replace with database ORM (Prisma, TypeORM)
- Interface remains the same for easy migration

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

## Product Module Architecture (Implemented)

### File Structure
```
src/
├── routes/
│   └── product.routes.js      # Route definitions
├── controllers/
│   └── product.controller.js  # Request/response handlers
├── services/
│   └── product.service.js     # Business logic
└── database/
    └── fileStorage.js         # JSON storage (shared)
```

### Layer Responsibilities

#### Routes Layer (`product.routes.js`)
- Defines 5 endpoints: GET /, GET /:id, POST /, PUT /:id, DELETE /:id
- Maps HTTP methods to controller functions
- No business logic - pure routing

#### Controller Layer (`product.controller.js`)
**Functions:**
- `getProducts()` - Handle GET /api/products
- `getProduct()` - Handle GET /api/products/:id
- `createProduct()` - Handle POST /api/products
- `updateProduct()` - Handle PUT /api/products/:id
- `deleteProduct()` - Handle DELETE /api/products/:id

**Responsibilities:**
- Extract data from `req.params`, `req.body`
- Call corresponding service function
- Format response: `{ status: 'success', data: ... }`
- Pass errors to error handler via `next(error)`
- **No business logic** - delegates to service layer

#### Service Layer (`product.service.js`)
**Functions:**
- `getAllProducts()` - Retrieve all products
- `getProductById(id)` - Find product by ID
- `createProduct(data)` - Create with validation
- `updateProduct(id, updates)` - Update with validation
- `deleteProduct(id)` - Delete product

**Responsibilities:**
- **Validation:** Check name (required), price (> 0)
- **Business Logic:** Generate IDs, timestamps
- **Data Operations:** Call `readJson()`, `writeJson()`
- **Error Handling:** Throw `AppError` for validation/not found
- **No HTTP concerns** - pure business logic

#### Database Layer (`fileStorage.js`)
- Shared helper used by product service
- `readJson('products.json')` - Read products array
- `writeJson('products.json', data)` - Save products array
- Handles all file errors gracefully

### Request Flow Example: Create Product

```
1. Client Request
   POST /api/products
   Body: { "name": "Laptop", "price": 1000 }
   ↓

2. Express Middleware Stack
   ├── CORS ✓
   ├── JSON Parser ✓ (parses body)
   └── Request Logger ✓ (logs request)
   ↓

3. Routes Layer (routes/index.js)
   Match: /api/products → productRoutes
   ↓

4. Product Routes (product.routes.js)
   Match: POST / → createProduct controller
   ↓

5. Product Controller (product.controller.js)
   ├── Extract: req.body = { name, price }
   ├── Call: productService.createProduct(req.body)
   └── Wait for response...
   ↓

6. Product Service (product.service.js)
   ├── Validate: name exists? ✓
   ├── Validate: price > 0? ✓
   ├── Call: readJson('products.json')
   │   └── Returns: existing products array
   ├── Generate: id (UUID), timestamps
   ├── Create: newProduct object
   ├── Add: newProduct to array
   ├── Call: writeJson('products.json', updatedArray)
   │   └── Returns: true (success)
   └── Return: newProduct to controller
   ↓

7. Database Layer (fileStorage.js)
   ├── readJson: Read data/products.json → parse → return array
   └── writeJson: Stringify → write to data/products.json → return true
   ↓

8. Controller Formats Response
   res.status(201).json({
     status: 'success',
     data: {
       id: 'uuid-here',
       name: 'Laptop',
       price: 1000,
       description: '',
       createdAt: '2026-06-01T01:31:00.000Z',
       updatedAt: '2026-06-01T01:31:00.000Z'
     }
   })
   ↓

9. Response Sent to Client
```

### Error Flow Example: Invalid Product

```
1. Client Request
   POST /api/products
   Body: { "name": "", "price": -10 }
   ↓

2-4. [Same as above through routes]
   ↓

5. Product Service (product.service.js)
   ├── Validate: name.trim() === '' ✗
   └── Throw: new AppError('Product name is required', 400)
   ↓

6. Controller Catches Error
   catch (error) {
     next(error);  // Pass to error handler
   }
   ↓

7. Error Handler Middleware (errorHandler.js)
   res.status(400).json({
     status: 'error',
     statusCode: 400,
     message: 'Product name is required'
   })
   ↓

8. Error Response Sent to Client
```

### Key Design Principles

1. **Separation of Concerns**
   - Routes: Define endpoints only
   - Controllers: Handle HTTP only
   - Services: Business logic only
   - Database: Data access only

2. **Single Responsibility**
   - Each function does one thing
   - Easy to test and maintain

3. **Consistent Error Handling**
   - Services throw `AppError`
   - Controllers catch and pass to middleware
   - Middleware formats error response

4. **Reusable Components**
   - `fileStorage.js` used by all modules
   - `AppError` used for all errors
   - Same pattern for products and orders

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
