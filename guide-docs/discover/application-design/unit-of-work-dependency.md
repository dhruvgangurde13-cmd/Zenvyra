# Unit of Work Dependencies

## Backend Top-Level Matrix
- **Auth (B1)** -> Depended upon by **Cart (B3)**, **Order (B4)**, **Product-Admin (B2)**. (Validates tokens & roles).
- **Product (B2)** -> Depended upon by **Cart (B3)** (Validating stock & price), and **Order (B4)** (Validating history prices vs dynamic items).
- **Cart (B3)** -> Depended upon by **Order (B4)**. (Orders read from cart values to establish Intent/Price).
- **Order (B4)** -> End of line dependency. Relies on external (Razorpay Test).

## Frontend Top-Level Matrix
- **Hero/Nav (F1)** -> Depended upon by all flows as general wrapper.
- **Auth UI (F2)** -> Required to interact with **Cart UI (F4)** and **Checkout UI (F5)** under constrained rules.
- **Product UI (F3)** -> Navigational predecessor to Cart/Checkout. Forms the core discovery interaction.
- **Cart UI (F4)** -> Direct predecessor to Checkout UI.
- **Admin UI (F6)** -> Totally isolated path. Requires Auth constraint injection.

## Data Schema Core Boundaries
- `User` Schema maps universally. (id is Primary Foreign Key across app).
- `Product` Schema contains atomic price constraints verified directly by `Order` layer upon generation to prevent frontend price-tampering.
- `CartItem` -> Soft converts into `OrderItem` upon successful payment verification. Carts are cleared via Service Hook after `Order` confirmation propagates.
