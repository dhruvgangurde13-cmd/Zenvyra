# Unit of Work Plan

This plan decomposes the Zenvyra application into logical, buildable units of work. It focuses on implementation-ready modules across the frontend and backend, avoiding unnecessary abstraction.

## Backend Units (FastAPI)

### Unit B1: Auth Module
- **Database Tables**: `users` (id, email, hashed_password, is_admin, created_at, updated_at).
- **Models**: SQLAlchemy `User`, Pydantic `UserCreate`, `UserResponse`, `Token`.
- **Services**: `AuthService` (hashing, JWT generation, user validation).
- **Endpoints**:
  - `POST /api/auth/register`
  - `POST /api/auth/login`

### Unit B2: Product Module
- **Database Tables**: `products` (id, title, description, price, image_url, category, stock, created_at, updated_at).
- **Models**: SQLAlchemy `Product`, Pydantic `ProductCreate`, `ProductUpdate`, `ProductResponse`.
- **Services**: `ProductService` (CRUD operations, pagination, filtering).
- **Endpoints**:
  - `GET /api/products` (List with pagination)
  - `GET /api/products/{id}` (Detail)
  - `POST /api/admin/products` (Admin only)
  - `PUT /api/admin/products/{id}` (Admin only)
  - `DELETE /api/admin/products/{id}` (Admin only)

### Unit B3: Cart Module
- **Database Tables**: `cart_items` (id, user_id, product_id, quantity, created_at, updated_at).
- **Models**: SQLAlchemy `CartItem`, Pydantic `CartItemCreate`, `CartItemUpdate`, `CartResponse`.
- **Services**: `CartService` (Add, update, remove, calculate total).
- **Endpoints** (Authenticated):
  - `GET /api/cart`
  - `POST /api/cart/items`
  - `PUT /api/cart/items/{id}`
  - `DELETE /api/cart/items/{id}`

### Unit B4: Order Module
- **Database Tables**:
  - `orders` (id, user_id, total_amount, status, razorpay_order_id, razorpay_payment_id, razorpay_signature, created_at, updated_at).
  - `order_items` (id, order_id, product_id, quantity, price_at_purchase).
- **Models**: SQLAlchemy `Order`, `OrderItem`, Pydantic `OrderCreate`, `OrderResponse`, `PaymentVerification`.
- **Services**: `OrderService` (Create order, integrate Razorpay test mode, verify payment, update status).
- **Endpoints** (Authenticated):
  - `POST /api/orders/checkout` (Generates local order and Razorpay intent)
  - `POST /api/orders/verify` (Validates Razorpay signature and updates status)
  - `GET /api/orders` (User's order history)
  - `GET /api/admin/orders` (Admin view all orders)

---

## Frontend Units (Next.js App Router)

### Unit F1: Base Setup & Mascot
- **Layout & Routing**: Next.js App Router base layout, global styles (Tailwind), consistent typography.
- **Components**: Navigation Header, Footer, Zeno Mascot component (Idle, Loading, Success states).
- **State/Auth Interface**: `useAuth` hook and Context Provider.

### Unit F2: Auth UI
- **Pages**: `/login`, `/register`.
- **Components**: JWT storage handling, Auth forms with validation.
- **Mapping**: Integrates with Unit B1 (`/api/auth/*`).

### Unit F3: Product UI
- **Pages**: `/` (Landing/Home with Hero Section and featured grid), `/products` (Catalog list), `/products/[id]` (Detail page).
- **Components**: `ProductCard`, `ProductGrid`.
- **Mapping**: Integrates with Unit B2 (`/api/products/*`).

### Unit F4: Cart UI
- **Components**: `CartDrawer` (Slide-out or dedicated modal for cart items).
- **Hooks**: `useCart` to interface with backend.
- **Mapping**: Integrates with Unit B3 (`/api/cart/*`).

### Unit F5: Checkout & Order UI
- **Pages**: `/checkout`, `/orders`.
- **Components**: Razorpay test script injector, Checkout form, Order success page with Zeno, Order history list.
- **Mapping**: Integrates with Unit B4 (`/api/orders/*`).

### Unit F6: Admin UI (Minimal)
- **Pages**: `/admin/products` (Catalog Management), `/admin/orders` (View orders).
- **Components**: Simple data tables and forms for creating/editing products.
- **Mapping**: Integrates with Unit B2 (`/api/admin/products/*`) and Unit B4 (`/api/admin/orders`).

---

## Generation Checkpoints

- [x] Execute `guide-docs/discover/application-design/unit-of-work.md` capturing the explicit mapping above.
- [x] Execute `guide-docs/discover/application-design/unit-of-work-dependency.md` summarizing the technical dependency bounds mapped above.
- [x] (Skipping `unit-of-work-story-map.md` as User Stories were excluded; relying directly on endpoint-to-frontend unit mapping).
