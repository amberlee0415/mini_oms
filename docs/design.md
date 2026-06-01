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

### Order Endpoints (Implemented ✅)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | /api/orders | Get all orders | - | `{ status, data: [...] }` |
| GET | /api/orders/:id | Get order by ID | - | `{ status, data: {...} }` |
| POST | /api/orders | Create new order | `{ customerName, orderItems: [...] }` | `{ status, data: {...} }` |
| PUT | /api/orders/:id | Update order | `{ customerName?, status?, orderItems?: [...] }` | `{ status, data: {...} }` |
| DELETE | /api/orders/:id | Delete order | - | `{ status, message }` |

**Order Data Structure:**
```javascript
{
  id: "uuid",                    // Auto-generated
  customerName: "string",        // Required
  date: "ISO 8601",              // Auto-generated
  status: "pending|completed",   // Default: "pending"
  orderItems: [                  // Required, not empty
    {
      productId: "uuid",         // Must exist in products.json
      productName: "string",     // Fetched from product
      unitPrice: number,         // Fetched from product (price integrity)
      quantity: number,          // From request, must be > 0
      subtotal: number           // Calculated: unitPrice × quantity
    }
  ],
  totalAmount: number,           // Calculated: sum of all subtotals
  createdAt: "ISO 8601",         // Auto-generated
  updatedAt: "ISO 8601"          // Auto-updated
}
```

**Business Rules:**
- **Product Validation:** Each `productId` must exist in `products.json`
- **Price Integrity:** `unitPrice` and `productName` fetched from product data (never trust frontend)
- **Calculation Logic:**
  - `subtotal = unitPrice × quantity` (per item)
  - `totalAmount = sum of all subtotals`
  - All calculations done on backend before saving
- **Data Validation:**
  - `customerName`: Required, non-empty
  - `orderItems`: Required, must contain at least one item
  - `quantity`: Must be number > 0

**Error Responses:**
```javascript
{
  status: "error",
  statusCode: 400|404|500,
  message: "Error description"
}
```

**Example Request (Create Order):**
```javascript
POST /api/orders
{
  "customerName": "John Doe",
  "orderItems": [
    {
      "productId": "product-uuid-1",
      "quantity": 2
    },
    {
      "productId": "product-uuid-2",
      "quantity": 1
    }
  ]
}
```

**Example Response:**
```javascript
{
  "status": "success",
  "data": {
    "id": "order-uuid",
    "customerName": "John Doe",
    "date": "2026-06-01T01:49:00.000Z",
    "status": "pending",
    "orderItems": [
      {
        "productId": "product-uuid-1",
        "productName": "Laptop",      // Fetched from product
        "unitPrice": 1200,             // Fetched from product
        "quantity": 2,
        "subtotal": 2400               // Calculated: 1200 × 2
      },
      {
        "productId": "product-uuid-2",
        "productName": "Mouse",        // Fetched from product
        "unitPrice": 25,               // Fetched from product
        "quantity": 1,
        "subtotal": 25                 // Calculated: 25 × 1
      }
    ],
    "totalAmount": 2425,               // Calculated: 2400 + 25
    "createdAt": "2026-06-01T01:49:00.000Z",
    "updatedAt": "2026-06-01T01:49:00.000Z"
  }
}
```

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

### Product UI Architecture (Implemented)

**Component Breakdown:**
```
ProductsPage (Page Component)
├── State Management (useState, useEffect)
├── API Integration (productApi service)
├── ProductTable Component
│   ├── Loading state (spinner)
│   ├── Empty state (no products message)
│   └── Product rows (name, description, price, actions)
├── ProductFormModal Component
│   ├── Form fields (name, description, price)
│   ├── Validation (name required, price > 0)
│   └── Submit (create or update)
└── ConfirmDeleteModal Component
    ├── Confirmation message
    └── Delete action
```

**Component Responsibilities:**

#### **ProductsPage** (Page Component)
- **State Management:**
  - `products` - Array of products
  - `loading` - Initial data fetch state
  - `actionLoading` - Create/update/delete action state
  - `error` - Error messages
  - `isFormModalOpen` - Form modal visibility
  - `isDeleteModalOpen` - Delete modal visibility
  - `selectedProduct` - Product being edited/deleted

- **Functions:**
  - `fetchProducts()` - Fetch all products from API
  - `handleCreate()` - Open form modal for new product
  - `handleEdit(product)` - Open form modal with product data
  - `handleDelete(product)` - Open delete confirmation modal
  - `handleFormSubmit(formData)` - Create or update product
  - `handleConfirmDelete()` - Delete product
  - `handleCloseModals()` - Close all modals

- **Data Flow:**
  - Fetches products on mount (useEffect)
  - Passes data to child components via props
  - Handles all API calls through productApi service
  - Re-fetches data after create/update/delete

#### **ProductTable** Component
- **Props:** `products`, `onEdit`, `onDelete`, `loading`
- **Responsibilities:**
  - Display products in table format
  - Show loading spinner during fetch
  - Show empty state when no products
  - Trigger edit/delete actions via callbacks
- **No API calls** - pure presentational component

#### **ProductFormModal** Component
- **Props:** `isOpen`, `onClose`, `onSubmit`, `product`, `loading`
- **Responsibilities:**
  - Display form for create/edit
  - Manage form state (name, description, price)
  - Validate input (name required, price > 0)
  - Submit data via callback
  - Pre-fill form when editing
- **No API calls** - delegates to parent

#### **ConfirmDeleteModal** Component
- **Props:** `isOpen`, `onClose`, `onConfirm`, `product`, `loading`
- **Responsibilities:**
  - Display confirmation message
  - Show product name being deleted
  - Trigger delete via callback
- **No API calls** - delegates to parent

**API Integration Flow:**
```
1. User Action (e.g., clicks "Create Product")
   ↓
2. ProductsPage handler (handleCreate)
   ↓
3. Opens ProductFormModal
   ↓
4. User fills form and submits
   ↓
5. ProductFormModal validates and calls onSubmit callback
   ↓
6. ProductsPage.handleFormSubmit receives data
   ↓
7. Calls productApi.create(formData)
   ↓
8. Service Layer (api.js)
   ├── Constructs request: POST /api/products
   ├── Sends to backend
   └── Returns response
   ↓
9. Backend processes request
   ├── Routes → Controller → Service → Database
   └── Returns: { status: 'success', data: {...} }
   ↓
10. ProductsPage receives response
    ├── Closes modal
    ├── Calls fetchProducts() to refresh list
    └── Updates UI with new data
```

**State Flow Example (Create Product):**
```
Initial State:
- products: []
- loading: true
- isFormModalOpen: false

User clicks "Create Product":
- isFormModalOpen: true
- selectedProduct: null

User submits form:
- actionLoading: true
- API call: productApi.create(data)

API success:
- actionLoading: false
- isFormModalOpen: false
- loading: true (refresh)
- API call: productApi.getAll()

Fetch complete:
- loading: false
- products: [newProduct, ...]
- UI updates with new product
```

**Error Handling:**
- API errors caught in try-catch
- Error displayed in alert (simple approach)
- Fetch errors shown in error banner with retry button
- Loading states prevent duplicate submissions

**UX Features:**
- Buttons disabled during API calls
- Loading indicators ("Saving...", "Deleting...")
- Form validation with error messages
- Empty state with helpful message
- Responsive table layout
- Modal overlays with backdrop

### Order UI Architecture (Implemented)

**Component Breakdown:**
```
OrdersPage (Page Component)
├── State Management (useState, useEffect)
├── API Integration (productApi, orderApi)
├── Customer Name Input
└── OrderGrid Component
    ├── OrderRow Component (multiple instances)
    │   ├── ProductDropdown Component
    │   ├── Product Name Display (auto-filled)
    │   ├── Unit Price Display (auto-filled)
    │   ├── Quantity Input
    │   ├── Subtotal Display (calculated)
    │   └── Remove Button
    └── OrderSummary Component
        └── Total Amount Display (calculated)
```

**Component Responsibilities:**

#### **OrdersPage** (Page Component)
- **State Management:**
  - `products` - Array of products from API
  - `orderRows` - Array of order items in grid
  - `customerName` - Customer name input
  - `loading` - Products fetch state
  - `submitting` - Order submission state
  - `error` - Error messages
  - `validationErrors` - Form validation errors

- **Functions:**
  - `fetchProducts()` - GET /api/products on mount
  - `validateOrder()` - Validate customerName and orderRows
  - `handleSubmit()` - Submit order to POST /api/orders
  - `handleReset()` - Clear form

- **Data Flow:**
  - Fetches products on mount
  - Passes products to OrderGrid
  - Receives orderRows updates from OrderGrid
  - Validates and submits to backend

#### **OrderGrid** Component
- **Props:** `products`, `orderRows`, `setOrderRows`
- **State:** `totalAmount` (calculated from orderRows)
- **Responsibilities:**
  - Render table with OrderRow components
  - Add new rows with "Add Item" button
  - Remove rows via callback
  - Calculate total amount in real-time
  - Update parent state (orderRows)
- **No API calls** - pure UI logic

#### **OrderRow** Component
- **Props:** `row`, `products`, `onProductChange`, `onQuantityChange`, `onRemove`
- **Responsibilities:**
  - Render single order item row
  - Handle product selection
  - Handle quantity changes
  - Display calculated subtotal
  - Trigger remove action
- **Calculation:** subtotal = unitPrice × quantity

#### **ProductDropdown** Component
- **Props:** `products`, `selectedProductId`, `onChange`, `disabled`
- **Responsibilities:**
  - Render dropdown with products from API
  - Display product name and price
  - Trigger selection callback
- **No state** - controlled component

#### **OrderSummary** Component
- **Props:** `totalAmount`
- **Responsibilities:**
  - Display total amount
  - Format currency
- **No logic** - pure presentation

**Real-time Calculation Flow:**

```
1. User selects product in dropdown
   ↓
2. ProductDropdown calls onChange(productId)
   ↓
3. OrderRow.handleProductChange()
   ├── Find product in products array
   ├── Extract: { id, name, price }
   └── Call: onProductChange(rowId, productData)
   ↓
4. OrderGrid.handleProductChange()
   ├── Update row in orderRows array:
   │   ├── productId = product.id
   │   ├── productName = product.name (AUTO-FILLED)
   │   ├── unitPrice = product.price (AUTO-FILLED)
   │   ├── quantity = existing quantity
   │   └── subtotal = unitPrice × quantity (CALCULATED)
   └── Call: setOrderRows(updatedRows)
   ↓
5. OrderGrid useEffect triggers
   ├── Detects orderRows change
   ├── Calculates: total = sum of all subtotals
   └── Updates: setTotalAmount(total)
   ↓
6. UI Updates
   ├── OrderRow shows productName, unitPrice, subtotal
   └── OrderSummary shows updated totalAmount
```

**Quantity Change Flow:**

```
1. User changes quantity input
   ↓
2. OrderRow.handleQuantityChange()
   ├── Parse: parseInt(value)
   └── Call: onQuantityChange(rowId, quantity)
   ↓
3. OrderGrid.handleQuantityChange()
   ├── Update row in orderRows array:
   │   ├── quantity = new quantity
   │   └── subtotal = unitPrice × quantity (RECALCULATED)
   └── Call: setOrderRows(updatedRows)
   ↓
4. OrderGrid useEffect triggers
   ├── Recalculates total amount
   └── Updates: setTotalAmount(total)
   ↓
5. UI Updates
   ├── OrderRow shows new subtotal
   └── OrderSummary shows updated totalAmount
```

**Order Submission Flow:**

```
1. User clicks "Create Order"
   ↓
2. OrdersPage.handleSubmit()
   ├── e.preventDefault()
   └── Call: validateOrder()
   ↓
3. Validation
   ├── Check: customerName.trim() !== '' ✓
   ├── Check: orderRows.length > 0 ✓
   ├── Check: all rows have productId and quantity > 0 ✓
   └── Result: Valid ✓
   ↓
4. Prepare Order Data
   orderData = {
     customerName: "John Doe",
     orderItems: [
       { productId: "prod-1", quantity: 2 },
       { productId: "prod-2", quantity: 1 }
     ]
   }
   Note: Only send productId and quantity
   Backend will fetch productName and unitPrice
   ↓
5. API Call
   ├── setSubmitting(true)
   ├── Call: orderApi.create(orderData)
   └── Wait for response...
   ↓
6. Service Layer (api.js)
   ├── POST /api/orders
   ├── Body: JSON.stringify(orderData)
   └── Returns promise
   ↓
7. Backend Processing
   ├── Validates productId exists
   ├── Fetches productName and unitPrice from products.json
   ├── Calculates subtotals and totalAmount
   ├── Saves to orders.json
   └── Returns: created order with all fields
   ↓
8. Response Received
   ├── setSubmitting(false)
   ├── Reset form: customerName = '', orderRows = []
   └── Show: alert('Order created successfully!')
   ↓
9. UI Updates
   ├── Form cleared
   └── Grid empty
```

**State Management Pattern:**

```javascript
// Immutable state updates
const handleProductChange = (rowId, productData) => {
  setOrderRows(orderRows.map(row => {
    if (row.id === rowId) {
      return {
        ...row,                          // Keep existing fields
        productId: productData.productId,
        productName: productData.productName,
        unitPrice: productData.unitPrice,
        subtotal: productData.unitPrice * row.quantity
      };
    }
    return row;                          // Return unchanged
  }));
};

// Add row (immutable)
const addRow = () => {
  setOrderRows([...orderRows, newRow]);  // Create new array
};

// Remove row (immutable)
const removeRow = (rowId) => {
  setOrderRows(orderRows.filter(row => row.id !== rowId));
};
```

**Validation Rules:**

1. **Customer Name:** Required, non-empty
2. **Order Items:** Must have at least one row
3. **Product Selection:** Each row must have productId
4. **Quantity:** Each row must have quantity > 0
5. **Submit Button:** Disabled if orderRows.length === 0

**Data Integrity:**

- **Product Data:** Fetched from GET /products API (not hardcoded)
- **Auto-fill:** productName and unitPrice from selected product
- **Frontend Calculation:** For display only (subtotal, totalAmount)
- **Backend Validation:** Backend recalculates and validates everything
- **Price Integrity:** Backend fetches prices from products.json (trusted source)

**UX Features:**

- Loading spinner while fetching products
- Error state with retry button
- Disabled buttons during submission
- Validation error messages
- Empty state message in grid
- Real-time subtotal and total updates
- Reset button to clear form
- Submit button disabled when no items

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

## Order Module Architecture (Implemented)

### File Structure
```
src/
├── routes/
│   └── order.routes.js        # Route definitions
├── controllers/
│   └── order.controller.js    # Request/response handlers
├── services/
│   └── order.service.js       # Business logic & calculations
└── database/
    └── fileStorage.js         # JSON storage (shared)
```

### Layer Responsibilities

#### Routes Layer (`order.routes.js`)
- Defines 5 endpoints: GET /, GET /:id, POST /, PUT /:id, DELETE /:id
- Maps HTTP methods to controller functions
- No business logic - pure routing

#### Controller Layer (`order.controller.js`)
**Functions:**
- `getOrders()` - Handle GET /api/orders
- `getOrder()` - Handle GET /api/orders/:id
- `createOrder()` - Handle POST /api/orders
- `updateOrder()` - Handle PUT /api/orders/:id
- `deleteOrder()` - Handle DELETE /api/orders/:id

**Responsibilities:**
- Extract data from `req.params`, `req.body`
- Call corresponding service function
- Format response: `{ status: 'success', data: ... }`
- Pass errors to error handler via `next(error)`
- **No business logic** - delegates to service layer

#### Service Layer (`order.service.js`)
**Functions:**
- `getAllOrders()` - Retrieve all orders
- `getOrderById(id)` - Find order by ID
- `createOrder(data)` - Create with validation and calculation
- `updateOrder(id, updates)` - Update with recalculation
- `deleteOrder(id)` - Delete order
- `validateAndEnrichOrderItems(items)` - **Key function** for product validation
- `calculateTotalAmount(items)` - Calculate total from items

**Responsibilities:**
- **Product Validation:** Verify each `productId` exists in products.json
- **Price Integrity:** Fetch `unitPrice` and `productName` from product data
- **Calculation Logic:** Calculate `subtotal` and `totalAmount` on backend
- **Data Validation:** Check customerName, orderItems, quantity
- **Error Handling:** Throw `AppError` for validation failures
- **No HTTP concerns** - pure business logic

#### Database Layer (`fileStorage.js`)
- Shared helper used by order service
- `readJson('orders.json')` - Read orders array
- `readJson('products.json')` - Read products for validation
- `writeJson('orders.json', data)` - Save orders array
- Handles all file errors gracefully

### Order Creation Flow (Step-by-Step)

```
1. Client Request
   POST /api/orders
   Body: {
     "customerName": "John Doe",
     "orderItems": [
       { "productId": "prod-1", "quantity": 2 },
       { "productId": "prod-2", "quantity": 1 }
     ]
   }
   ↓

2. Express Middleware Stack
   ├── CORS ✓
   ├── JSON Parser ✓
   └── Request Logger ✓
   ↓

3. Routes Layer (order.routes.js)
   Match: POST / → createOrder controller
   ↓

4. Controller Layer (order.controller.js)
   ├── Extract: req.body = { customerName, orderItems }
   ├── Call: orderService.createOrder(req.body)
   └── Wait for response...
   ↓

5. Service Layer (order.service.js)
   Step 1: Validate customerName
   ├── Check: customerName.trim() !== '' ✓
   └── Result: Valid
   
   Step 2: Validate and Enrich Order Items
   ├── Call: validateAndEnrichOrderItems(orderItems)
   │   ↓
   │   For each item in orderItems:
   │   ├── Validate quantity > 0 ✓
   │   ├── Validate productId exists ✓
   │   ├── Call: readJson('products.json')
   │   ├── Find product by productId
   │   │   ├── If not found → throw AppError('Product not found', 404)
   │   │   └── If found → continue
   │   ├── Fetch productName from product ✓
   │   ├── Fetch unitPrice from product ✓ (PRICE INTEGRITY)
   │   ├── Calculate subtotal = unitPrice × quantity
   │   └── Return enriched item: {
   │         productId,
   │         productName,    // From product data
   │         unitPrice,      // From product data
   │         quantity,       // From request
   │         subtotal        // Calculated
   │       }
   │   ↓
   └── Result: enrichedItems = [
         { productId: "prod-1", productName: "Laptop", unitPrice: 1200, quantity: 2, subtotal: 2400 },
         { productId: "prod-2", productName: "Mouse", unitPrice: 25, quantity: 1, subtotal: 25 }
       ]
   
   Step 3: Calculate Total Amount
   ├── Call: calculateTotalAmount(enrichedItems)
   ├── Logic: sum of all subtotals
   ├── Calculation: 2400 + 25 = 2425
   └── Result: totalAmount = 2425
   
   Step 4: Create Order Object
   newOrder = {
     id: randomUUID(),
     customerName: "John Doe",
     date: "2026-06-01T01:49:00.000Z",
     status: "pending",
     orderItems: enrichedItems,
     totalAmount: 2425,        // Backend-calculated
     createdAt: "2026-06-01T01:49:00.000Z",
     updatedAt: "2026-06-01T01:49:00.000Z"
   }
   
   Step 5: Save to Database
   ├── Call: readJson('orders.json')
   ├── Add newOrder to array
   ├── Call: writeJson('orders.json', updatedArray)
   └── Return: newOrder
   ↓

6. Database Layer (fileStorage.js)
   ├── readJson('products.json') → validate products exist
   ├── readJson('orders.json') → get existing orders
   └── writeJson('orders.json', [...orders, newOrder]) → save
   ↓

7. Controller Formats Response
   res.status(201).json({
     status: 'success',
     data: newOrder
   })
   ↓

8. Response Sent to Client
   {
     "status": "success",
     "data": {
       "id": "order-uuid",
       "customerName": "John Doe",
       "date": "2026-06-01T01:49:00.000Z",
       "status": "pending",
       "orderItems": [
         {
           "productId": "prod-1",
           "productName": "Laptop",
           "unitPrice": 1200,
           "quantity": 2,
           "subtotal": 2400
         },
         {
           "productId": "prod-2",
           "productName": "Mouse",
           "unitPrice": 25,
           "quantity": 1,
           "subtotal": 25
         }
       ],
       "totalAmount": 2425,
       "createdAt": "2026-06-01T01:49:00.000Z",
       "updatedAt": "2026-06-01T01:49:00.000Z"
     }
   }
```

### Price Integrity Enforcement

**Problem:** Frontend could send fake prices to manipulate order totals

**Solution:** Backend fetches prices from products.json

```javascript
// ❌ WRONG - Trusting frontend data
const item = {
  productId: req.body.productId,
  unitPrice: req.body.unitPrice,  // Could be manipulated!
  quantity: req.body.quantity
};

// ✅ CORRECT - Fetching from product data
const product = products.find(p => p.id === item.productId);
const item = {
  productId: product.id,
  productName: product.name,      // From database
  unitPrice: product.price,       // From database (trusted)
  quantity: req.body.quantity,
  subtotal: product.price * req.body.quantity  // Calculated with trusted price
};
```

### Calculation Logic

**Subtotal Calculation (Per Item):**
```javascript
subtotal = unitPrice × quantity
```

**Total Amount Calculation:**
```javascript
totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0)
```

**Example:**
```
Order Items:
- Laptop: $1200 × 2 = $2400
- Mouse: $25 × 1 = $25

Total Amount: $2400 + $25 = $2425
```

### Data Validation Rules

1. **Customer Name:** Required, non-empty string
2. **Order Items:** Must be array with at least one item
3. **Product ID:** Must exist in products.json
4. **Quantity:** Must be number > 0
5. **Status:** Defaults to "pending" if not provided

### Error Scenarios

**Scenario 1: Product Not Found**
```
Request: { productId: "invalid-id", quantity: 2 }
↓
Service validates productId against products.json
↓
Product not found
↓
throw new AppError('Product with ID invalid-id not found', 404)
↓
Response: { status: 'error', statusCode: 404, message: '...' }
```

**Scenario 2: Invalid Quantity**
```
Request: { productId: "valid-id", quantity: 0 }
↓
Service validates quantity > 0
↓
Validation fails
↓
throw new AppError('Each item must have a valid quantity greater than 0', 400)
↓
Response: { status: 'error', statusCode: 400, message: '...' }
```

**Scenario 3: Empty Order Items**
```
Request: { customerName: "John", orderItems: [] }
↓
Service validates orderItems.length > 0
↓
Validation fails
↓
throw new AppError('Order must contain at least one item', 400)
↓
Response: { status: 'error', statusCode: 400, message: '...' }
```

### Key Design Principles

1. **Never Trust Frontend Data**
   - Prices fetched from products.json
   - Totals calculated on backend
   - Product names fetched from database

2. **Data Integrity**
   - Product validation ensures referential integrity
   - Orders can only reference existing products
   - Prevents orphaned order items

3. **Calculation Consistency**
   - All calculations in one place (service layer)
   - Same logic for create and update
   - Recalculates totals when items change

4. **Error Handling**
   - Clear error messages
   - Proper HTTP status codes
   - Validation before database operations

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
