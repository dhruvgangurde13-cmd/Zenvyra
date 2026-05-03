from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import auth, products, cart, orders, admin
from app.core.config import settings
from app.api.api import api_router
from app.db.database import engine, Base
import os

print("STARTING APP...")
print("POSTGRES_USER:", os.getenv("POSTGRES_USER"))
print("POSTGRES_SERVER:", os.getenv("POSTGRES_SERVER"))
print("POSTGRES_DB:", os.getenv("POSTGRES_DB"))
print("SECRET_KEY:", os.getenv("SECRET_KEY"))
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

@app.get("/")
def root():
    return {"message": "Welcome to Zenvyra API"}
