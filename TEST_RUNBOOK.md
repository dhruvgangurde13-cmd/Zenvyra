# Zenvyra Manual Testing Runbook

To fully explore and manually validate the integration between the premium Next.js UI frontend and the FastAPI backend, proceed with the following steps.

## Prerequisites
Open two separate terminal windows.

### Terminal 1 (Backend)
1. Navigate to the backend: `cd backend`
2. Activate environment: `.\venv\Scripts\Activate.ps1`
3. If not already seeded, populate mock products: `python seed.py`
4. Boot the server: `uvicorn app.main:app --reload`
*(The API will be live at `http://127.0.0.1:8000`)*

### Terminal 2 (Frontend)
1. Navigate to the frontend: `cd frontend`
2. Spin up Next.js: `npm run dev`
*(The UI will be accessible at `http://localhost:3000`)*

## Walkthrough Path

### 1. Registration & Auth (/login)
- Navigate to `http://localhost:3000/login`
- Toggle to **Sign Up** via the UI link. Create an account with an email and password.
- Verify that logging in successfully kicks you out to the **Shop/Products** or Home screen, saving your JWT behind the scenes.

### 2. Exploring Zeno on Home Stage (/)
- Go to `http://localhost:3000/` and notice **Zeno**, the mascot, happily drifting above the Output Buffer simulation.

### 3. Shopping Flow (/products, /cart)
- Head to **Shop** and click "Add to Cart" on a product.
- Navigate to the **Cart** via the top navigation bag icon.
- Observe Zeno's state. If you clear the cart or view an empty cart, Zeno will appear **slightly sad**. 
- Adjust the quantities for a product to trigger an "out of stock/backend validation" error. A Sonner toast will smoothly alert you if you hit the product limit.

### 4. Checkout Simulation
- With items softly loaded into the cart, hit **Simulate Payment**.
- Notice the mock verification waiting period and UI state changes.
- Upon simulated signature success, notice the automatic trajectory towards `/orders/success`.

### 5. Order Success
- Arrive at the `Order Success` page.
- Note the Confetti overlay (implemented securely using CSS/Framer).
- Spot **Zeno** eagerly bouncing with a happy, curved smile—relishing in your success.

## Edge Cases to Check Natively
- Attempt going straight to `/cart` directly without logging in. You should be punted to the `/login` route.
- Open the database locally (DB viewer or sqlite command) to see order atomic subtraction after a successful checkout.
