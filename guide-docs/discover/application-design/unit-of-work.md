# Zenvyra Units of Work

## Backend Units Boundary & Scope

### Unit B1: Auth Module
- **Domain**: User Identity & Security
- **Strict Logic Constraint**: 
  - All protected routes MUST require JWT mapping via dependency injection.
  - Generates robust tokens validating `user_id` and role context (`is_admin: Boolean`).
  - Passwords hashed using bcrypt.

### Unit B2: Product Module
- **Domain**: Catalog Presentation & Inventory
- **Strict Logic Constraint**: 
  - Standard user endpoints are GET only and globally accessible.
  - Admin endpoints (POST, PUT, DELETE) explicitly enforce an `is_admin == true` check inside the router dependency before touching service methods.
  - Schema consistency enforced between Pydantic mapping and Next.js interfaces.

### Unit B3: Cart Module
- **Domain**: Transient Shopping Session
- **Strict Logic Constraint**: 
  - Cart states are ALWAYS scoped directly to `user_id`. No sharing, no guest persistence required in MVP (require login to use cart).
  - Calculated securely on backend, frontend acts as a dump proxy for cart totals.

### Unit B4: Order Module
- **Domain**: Purchasing & Payment Life Cycle
- **Strict Logic Constraint**: 
  - Order status is explicitly typed: `pending`, `paid`, `failed`.
  - Flow: Create Order (`pending`) -> Send Razorpay Intent -> Frontend widget confirms -> Send Verification to backend -> Mark `paid`.

---

## Frontend Units Boundary & Scope

### Unit F1: Base Setup & Mascot (Zeno)
- **UI Domain**: Shell Context
- **Boundary**: Wrapper containing Navigation, generic logic (Auth provider), and Zeno standard logic injection.

### Unit F2: Auth UI
- **UI Domain**: Onboarding
- **Boundary**: Clean minimal login/register adhering to strict Nike/Apple minimal black/white UI with slight purple glow inputs.

### Unit F3: Product UI
- **UI Domain**: Catalog Shopping
- **Boundary**: Paginated generic list parsing standard server responses. PDP (Product Detail Page) fetching singular properties.

### Unit F4: Cart UI
- **UI Domain**: Drawer/Summary Interaction
- **Boundary**: Pulling exact calculations from B3 to maintain absolute consistency.

### Unit F5: Checkout & Order UI
- **UI Domain**: Conversion
- **Boundary**: Handles Razorpay script mounting. Intercepts handler on successful payment and explicitly calls the Verification endpoint in B4.

### Unit F6: Admin UI
- **UI Domain**: Basic Management
- **Boundary**: Accessible only if token carries `is_admin`. Basic generic forms for CRUD mapping directly to B2 methods.

---

## Code Organization (Greenfield)
Because there are no complex microservices required, Zenvyra uses standard MVC-inspired monorepos or standard dual-repos.

**Backend Schema Structure:**
```
/backend
  /app
    /api           # HTTP Routers (AuthRouter, ProductRouter, etc.)
    /core          # SecurityConfig, DB engine 
    /models        # SQLAlchemy models
    /schemas       # Pydantic validation boundaries
    /services      # Business Logic (OrderService, etc)
```

**Frontend Schema Structure:**
```
/frontend
  /src
    /app           # Next.js App Router folders
    /components    # Reusable UI (Mascot, Cards, Buttons)
    /lib           # API interaction and generic providers
```
