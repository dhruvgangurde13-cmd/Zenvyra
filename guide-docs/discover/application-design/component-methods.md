# Component Methods & API Signatures

## 🖥️ Frontend Hooks & Methods (Client-side)

### Auth Flow
- `useAuth()`: Provides `user` state, `login(email, password)`, `register(data)`, `logout()`.

### Product Catalog
- `useProducts(params)`: Fetches products with pagination and filters. Returns `data`, `isLoading`.
- `getProduct(id)`: Fetches single product details.

### Cart Operations
- `useCart()`: Provides `cartItems`, `addToCart(productId, qty)`, `updateQuantity(itemId, qty)`, `removeFromCart(itemId)`.

### Checkout & Connectivity
- `initiatePayment(orderData)`: Calls backend to create Razorpay order and mounts the Razorpay checkout widget.
- `verifyPayment(response)`: Sends Razorpay success payload back to API for verification.

## ⚙️ Backend API Signatures (FastAPI)

### AuthRouter
- `POST /auth/register` (In: UserCreate, Out: UserResponse)
- `POST /auth/login` (In: OAuth2PasswordRequestForm, Out: Token)

### ProductRouter
- `GET /products` (In: skip, limit, Out: List[ProductResponse])
- `GET /products/{id}` (In: id, Out: ProductResponse)
- `POST /admin/products` [Admin] (In: ProductCreate, Out: ProductResponse)
- `DELETE /admin/products/{id}` [Admin] (In: id, Out: SuccessMessage)

### CartRouter
- `GET /cart` (In: Dependencies(Token), Out: CartResponse)
- `POST /cart/items` (In: CartItemCreate, Out: CartResponse)
- `PUT /cart/items/{id}` (In: CartItemUpdate, Out: CartResponse)

### OrderRouter
- `POST /orders/checkout` (creates order + razorpay intent) (In: CheckoutRequest, Out: CheckoutResponse)
- `POST /orders/verify` (In: PaymentVerification, Out: OrderResponse)
- `GET /orders` (In: Dependencies(Token), Out: List[OrderResponse])
- `GET /admin/orders` [Admin] (In: skip, limit, Out: List[OrderResponse])
