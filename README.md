<![CDATA[<div align="center">

#  Zenvyra

**A premium, full-stack e-commerce platform built for speed, elegance, and scale.**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## 🧬 Overview

Zenvyra is a modern e-commerce platform featuring a **Next.js 16** storefront powered by a **FastAPI** backend with **PostgreSQL** persistence. The platform ships with JWT-based authentication, a real-time shopping cart, order management, and a delightful UI anchored by **Zeno** — the brand mascot.

---

##  Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Client (Browser)                  │
│              Next.js 16 · React 19 · TW4            │
└──────────────────────┬──────────────────────────────┘
                       │  REST / JSON
┌──────────────────────▼──────────────────────────────┐
│                  FastAPI Backend                     │
│          /api/auth · /api/products · /api/cart       │
│                    /api/orders                       │
└──────────────────────┬──────────────────────────────┘
                       │  SQLAlchemy ORM
┌──────────────────────▼──────────────────────────────┐
│                 PostgreSQL Database                  │
│     users · products · cart_items · orders · items   │
└─────────────────────────────────────────────────────┘
```

---

##  Project Structure

```
zenvyra/
├── backend/                   # FastAPI application
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/     # Route handlers
│   │   │   │   ├── auth.py        # Register / Login / JWT
│   │   │   │   ├── products.py    # Product CRUD
│   │   │   │   ├── cart.py        # Cart management
│   │   │   │   └── orders.py      # Order placement & history
│   │   │   ├── api.py         # Router aggregation
│   │   │   └── deps.py        # Auth dependencies
│   │   ├── core/
│   │   │   └── config.py      # Settings (Pydantic)
│   │   ├── db/
│   │   │   └── database.py    # Engine & session factory
│   │   ├── schemas/           # Pydantic request/response models
│   │   ├── services/          # Business logic layer
│   │   └── main.py            # Application entrypoint
│   ├── seed.py                # Database seeder
│   └── requirements.txt       # Python dependencies
│
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── layout.tsx         # Root layout
│   │   │   ├── globals.css        # Global styles
│   │   │   ├── products/          # Product catalog
│   │   │   ├── cart/              # Shopping cart
│   │   │   ├── orders/            # Order history
│   │   │   ├── login/             # Sign in
│   │   │   └── register/         # Sign up
│   │   ├── components/
│   │   │   ├── Zeno.tsx           # Brand mascot
│   │   │   └── Mascot.tsx         # Mascot variant
│   │   └── lib/                   # Utilities & API client
│   ├── public/
│   │   └── products/              # Product images
│   └── package.json
│
└── run.ps1                    # One-command local launcher
```

---

##  Quick Start

### Prerequisites

| Tool          | Version     |
|---------------|-------------|
| **Node.js**   | ≥ 18        |
| **Python**    | ≥ 3.11      |
| **PostgreSQL**| ≥ 15        |

### 1 · Clone the repository

```bash
git clone https://github.com/<your-username>/zenvyra.git
cd zenvyra
```

### 2 · Set up the backend

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3 · Configure the database

Create a PostgreSQL database named `zenvyra`, then update `backend/app/core/config.py` or set environment variables:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<your-password>
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=zenvyra
```

### 4 · Seed & start the backend

```bash
python seed.py
uvicorn app.main:app --reload --port 8000
```

### 5 · Set up & start the frontend

```bash
cd ../frontend
npm install
npm run dev
```

### 6 · (Optional) One-command launch (Windows)

```powershell
.\run.ps1
```

The app will be available at:

| Service   | URL                          |
|-----------|------------------------------|
| Frontend  | `http://localhost:3000`       |
| Backend   | `http://127.0.0.1:8000`      |
| API Docs  | `http://127.0.0.1:8000/docs` |

---

## 🔌 API Reference

All endpoints are prefixed with `/api`.

### Auth

| Method | Endpoint             | Description        | Auth |
|--------|----------------------|--------------------|------|
| POST   | `/api/auth/register` | Create account     | ✗    |
| POST   | `/api/auth/login`    | Get JWT token      | ✗    |

### Products

| Method | Endpoint           | Description          | Auth |
|--------|--------------------|----------------------|------|
| GET    | `/api/products`    | List all products    | ✗    |
| GET    | `/api/products/:id`| Get product details  | ✗    |

### Cart

| Method | Endpoint             | Description           | Auth |
|--------|----------------------|-----------------------|------|
| GET    | `/api/cart`          | View cart             | ✓    |
| POST   | `/api/cart`          | Add item to cart      | ✓    |
| DELETE | `/api/cart/:id`      | Remove item from cart | ✓    |

### Orders

| Method | Endpoint          | Description           | Auth |
|--------|-------------------|-----------------------|------|
| POST   | `/api/orders`     | Place order from cart | ✓    |
| GET    | `/api/orders`     | View order history    | ✓    |

> Full interactive API documentation is available at `/docs` (Swagger UI) when the backend is running.

---

## 🛠️ Tech Stack

| Layer      | Technology                                         |
|------------|----------------------------------------------------|
| Frontend   | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4 |
| Animations | Framer Motion                                      |
| Icons      | Lucide React                                       |
| Toasts     | Sonner                                             |
| Backend    | FastAPI, Pydantic v2, SQLAlchemy 2.0                |
| Auth       | JWT (python-jose), Passlib + bcrypt                 |
| Database   | PostgreSQL                                         |
| Runtime    | Python 3.11+, Node.js 18+                           |

---

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">
  <sub>Built by <strong>Dhruv</strong></sub>
</div>
]]>
