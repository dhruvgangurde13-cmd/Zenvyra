# run.ps1
Write-Host "Zenvyra Runner Script Started" -ForegroundColor Green

# 1. Start Backend in background
Write-Host "Starting FastAPI Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000"

# 2. Seed the DB locally
Write-Host "Seeding database..." -ForegroundColor Yellow
cd backend
.\venv\Scripts\python.exe seed.py
cd ..

# 3. Start Frontend in background
Write-Host "Starting Next.js Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Zenvyra is running!" -ForegroundColor Green
Write-Host "Backend API: http://127.0.0.1:8000"
Write-Host "Frontend App: http://localhost:3000"