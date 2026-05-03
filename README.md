# Zenvyra – Premium E-commerce Experience

Zenvyra is a full-stack e-commerce platform built to deliver a clean, premium user interface. It features a responsive design, an administrative dashboard for full catalog and order management, and an interactive mascot named Zeno to guide users through their journey.

## Features
- User authentication (JWT)
- Product browsing
- Cart system
- Order management
- Admin dashboard (CRUD for products, orders)
- Animated mascot (Zeno)
- Responsive design

## Tech Stack

**Frontend:**
- Next.js (App Router)
- Tailwind CSS
- Framer Motion

**Backend:**
- FastAPI
- PostgreSQL
- SQLAlchemy

## Screenshots
> [!NOTE]
> Screenshots placeholders. Replace these with actual images.

![Hero Section Placeholder](/docs/hero-placeholder.png)
![Admin Dashboard Placeholder](/docs/admin-placeholder.png)

## Installation Guide

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables
Create a `.env` file in the `backend` directory based on this example:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/zenvyra"

# JWT Auth Configuration
SECRET_KEY="super-secret-key-replace-me"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

## Folder Structure
```text
Zenvyra/
├── backend/       # FastAPI application, SQLAlchemy models, and API routes
├── frontend/      # Next.js App Router, Tailwind CSS, and React components
├── .gitignore     # Git ignore rules
└── README.md      # Project documentation
```

## Future Improvements
- Integrate a live payment gateway (e.g., Stripe or Razorpay)
- Add product reviews and ratings
- Implement automated email notifications for order status
- Expand analytics and visualization on the Admin Dashboard
