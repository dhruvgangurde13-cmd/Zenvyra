# Application Components

## 🖥️ Frontend Components (Next.js)

### 1. Presentation & Structure
- **RootLayout**: Global layout wrapper providing providers, header, and footer.
- **Header**: Navigation bar containing branding, cart trigger, and auth states.
- **HeroSection**: Landing page hook featuring the Zeno mascot and primary CTA.
- **Mascot (Zeno)**: Reusable animated component handling idle, loading, and success states.

### 2. Product Catalog
- **ProductGrid**: Manages the display and pagination of multiple `ProductCard`s.
- **ProductCard**: Minimalist card displaying product image, price, and hover add-to-cart.
- **ProductDetail**: PDP view showing high-res images and detailed descriptions.

### 3. Shopping Cart & Checkout
- **CartDrawer**: Slide-out panel managing transient cart items and quantities.
- **CheckoutFlow**: Manages shipping, billing, and Razorpay integration forms.

### 4. User & Admin
- **AuthForms**: Login and Registration forms with validation.
- **OrderHistory**: User-specific view of past orders and status.
- **AdminDashboard**: Minimal dashboard for product CRUD and order viewing.

---

## ⚙️ Backend Components (FastAPI)

### 1. Routers (Controllers)
- **AuthRouter**: Handles `/auth` endpoints (login, register).
- **ProductRouter**: Handles `/products` endpoints (list, get, create, delete).
- **CartRouter**: Handles `/cart` endpoints (add, update, remove).
- **OrderRouter**: Handles `/orders` endpoints (create order, verify payment).

### 2. Data Models (SQLAlchemy & Pydantic)
- **UserModels**: DB and Schema models for Users.
- **ProductModels**: DB and Schema models for Products.
- **CartModels**: DB and Schema models for Cart Items.
- **OrderModels**: DB and Schema models for Orders.

### 3. Core Capabilities
- **DatabaseConfig**: Engine and session maker configurations.
- **SecurityConfig**: JWT encoding/decoding and password hashing.
