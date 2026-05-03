# Service Layer Design

In alignment with strict architecture rules avoiding over-engineering, the backend relies on a direct **Service Layer** to isolate business logic from HTTP Routers.

## 1. AuthService
- **Responsibilities**: Password hashing, JWT token generation, User creation, User validation.
- **Key Methods**: 
  - `authenticate_user(email, password)`
  - `create_user(user_data)`
  - `create_access_token(data)`

## 2. ProductService
- **Responsibilities**: Reading product catalog, managing product stock, CRUD operations for admin.
- **Key Methods**:
  - `get_products(skip, limit)`
  - `create_product(product_data)`
  - `delete_product(product_id)`

## 3. CartService
- **Responsibilities**: Calculating cart totals, validating product availability, managing cart session states for a user.
- **Key Methods**:
  - `add_item(user_id, product_id, qty)`
  - `calculate_total(user_id)`

## 4. Order & PaymentService
- **Responsibilities**: Orchestrating checkout, communicating with Razorpay (test mode) to generate order IDs, validating payment signatures, transitioning cart to order status.
- **Key Methods**:
  - `initiate_checkout(user_id)` -> creates local order & Razorpay order
  - `verify_payment(razorpay_signature, order_id)` -> marks Order as PAID
  - `get_user_orders(user_id)`
