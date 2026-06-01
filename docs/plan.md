# Implementation Roadmap

## Project Overview
Mini OMS (Order Management System) - A modern monorepo application for managing products and orders.

---

## Phase 1: Foundation Setup ✅
**Status:** Complete

### Tasks Completed
- [x] Initialize npm workspaces monorepo
- [x] Set up React 19 + Vite frontend
- [x] Configure Tailwind CSS
- [x] Set up Express backend
- [x] Configure concurrent development scripts
- [x] Create data storage structure
- [x] Set up documentation framework
- [x] **Backend Architecture Setup** - Implemented clean architecture with:
  - Routes layer (health.routes.js, index.js)
  - Controllers layer (health.controller.js)
  - Services layer (health.service.js)
  - Middleware (errorHandler, notFound, logger)
  - Utils (asyncHandler, AppError)
  - Database helpers (fileStorage.js)
  - Health check endpoint: GET /api/health
- [x] **JSON Storage Helper Implementation** - Enhanced database layer with:
  - `readJson(filename)` - Robust JSON file reader with error handling
  - `writeJson(filename, data)` - Safe JSON file writer
  - Handles file not found, empty files, and corrupted JSON gracefully
  - Prevents server crashes from file system errors
  - Ready for products.json and orders.json operations

---

## Phase 2: Product Management
**Status:** Backend Complete ✅ | Frontend Pending

### Backend Tasks ✅
- [x] **Product CRUD API Implementation** - Complete REST API with:
  - Routes: product.routes.js (GET, POST, PUT, DELETE endpoints)
  - Controller: product.controller.js (request/response handling)
  - Service: product.service.js (business logic and validation)
  - GET /api/products (list all products)
  - GET /api/products/:id (get single product)
  - POST /api/products (create product with validation)
  - PUT /api/products/:id (update product with validation)
  - DELETE /api/products/:id (delete product)
  - Input validation (name required, price > 0)
  - Error handling with AppError
  - Uses JSON storage helper (readJson/writeJson)
  - Consistent response format (status, data/message)

### Frontend Tasks
- [x] **Frontend Architecture Setup** - Implemented folder structure and routing:
  - Folder structure: pages/, components/, hooks/, services/, layouts/, utils/
  - React Router v7 configured with BrowserRouter
  - MainLayout with navigation (Product Management, Order Management)
  - ProductsPage placeholder (/products route)
  - OrdersPage placeholder (/orders route)
  - API service layer (api.js with productApi and orderApi methods)
  - Root route (/) redirects to /products
  - Clean separation: pages for routes, layouts for UI structure, services for API
- [x] **Product Management UI Implementation** - Complete frontend-backend integration:
  - ProductTable component (displays products with Edit/Delete actions)
  - ProductFormModal component (create & edit with validation)
  - ConfirmDeleteModal component (delete confirmation)
  - ProductsPage with full state management (useState, useEffect)
  - CRUD operations: Create, Read, Update, Delete
  - Form validation (name required, price > 0)
  - Loading states (initial load, action loading)
  - Error handling (API failures with retry)
  - Empty state (no products message)
  - Responsive UI with Tailwind CSS
  - Data flow: Page → productApi service → Backend API → Response → UI update

---

## Phase 3: Order Management
**Status:** Backend Complete ✅ | Frontend Pending

### Backend Tasks ✅
- [x] **Order CRUD API Implementation** - Complete REST API with business logic:
  - Routes: order.routes.js (GET, POST, PUT, DELETE endpoints)
  - Controller: order.controller.js (request/response handling)
  - Service: order.service.js (business logic, validation, calculations)
  - GET /api/orders (list all orders)
  - GET /api/orders/:id (get single order)
  - POST /api/orders (create order with validation and calculation)
  - PUT /api/orders/:id (update order with recalculation)
  - DELETE /api/orders/:id (delete order)
  - **Product Integration:** Validates productId against products.json
  - **Price Integrity:** Fetches unitPrice from product data (not frontend)
  - **Calculation Logic:** Backend calculates subtotal and totalAmount
  - **Data Validation:** customerName required, orderItems not empty, quantity > 0
  - **Business Rules:** totalAmount = sum of (unitPrice × quantity) for all items
  - Uses JSON storage helper (readJson/writeJson)
  - Error handling with AppError

### Frontend Tasks
- [x] **Interactive Order Entry Grid Implementation** - Complete order creation UI:
  - ProductDropdown component (fetches from GET /products API)
  - OrderRow component (single row with product selection, quantity, subtotal)
  - OrderSummary component (displays real-time total amount)
  - OrderGrid component (manages rows, add/remove, calculations)
  - OrdersPage with full state management and validation
  - **Product Integration:** Dropdown populated from products API
  - **Auto-fill:** productName and unitPrice auto-filled on product selection
  - **Real-time Calculation:** subtotal = unitPrice × quantity (per row)
  - **Total Calculation:** totalAmount = sum of all subtotals (updates live)
  - **Validation:** customerName required, orderItems not empty, quantity > 0
  - **UX:** Add/remove rows, loading states, error handling, disabled buttons
  - **Data Flow:** Grid state → validation → API submission → backend validation
  - Clean component separation and immutable state updates
- [ ] Create Order list/history view
- [ ] Implement order update/delete operations
- [x] **Order Calculation Refactor** - Centralized calculation logic:
  - Created shared utility: `orderCalculations.js` (backend and frontend)
  - Functions: `calculateSubtotal(unitPrice, quantity)`, `calculateOrderTotal(orderItems)`
  - Refactored backend service to use shared utilities
  - Refactored frontend OrderGrid to use shared utilities
  - Eliminated all duplicated calculation logic
  - Ensures consistency between frontend and backend
  - Same formulas: subtotal = unitPrice × quantity, total = sum of subtotals
- [x] **System Hardening & Bug Fixes** - Enhanced validation and reliability:
  - **Backend Validation:** Strengthened to handle NaN, Infinity, null, undefined, non-integers
  - **Product Validation:** Price and name validation with type checking
  - **Order Validation:** Quantity must be positive integer, productId validation
  - **Submission Safety:** Duplicate submission prevention in ProductsPage and OrdersPage
  - **Frontend Validation:** Quantity input validation, step=1 to prevent decimals
  - **Storage Reliability:** JSON file handling already robust (empty/corrupted files)
  - **Data Integrity:** Backend validates all data before persistence
  - Issues fixed: Invalid quantities, malformed payloads, duplicate submissions

---

## Phase 4: Enhancement (Optional)
**Status:** Not Started

### Potential Features
- [ ] Add React Router for navigation
- [ ] Add state management (Zustand/Redux)
- [ ] Add search and filtering
- [ ] Add pagination
- [ ] Add sorting
- [ ] Add authentication
- [ ] Migrate to database (PostgreSQL/MongoDB)
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Add Docker configuration
- [ ] Add CI/CD pipeline

---

## Development Guidelines

### Code Standards
- Use ES modules throughout
- Follow React 19 best practices
- Use functional components with hooks
- Implement proper error handling
- Add meaningful comments for complex logic

### Git Workflow
- Create feature branches for new features
- Write descriptive commit messages
- Review code before merging

### Testing Strategy
- Test API endpoints manually first
- Add automated tests later
- Test edge cases and error scenarios

---

## Notes
- Update this document as development progresses
- Mark tasks complete as they are finished
- Add new phases as requirements evolve
