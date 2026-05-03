import os
import sys
from decimal import Decimal

# Add the backend directory to sys.path so app can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal, engine, Base
from app.db.models import Product, User
from app.core.security import get_password_hash

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed Admin User
    admin = db.query(User).filter(User.email == "admin@zenvyra.com").first()
    if not admin:
        admin = User(
            email="admin@zenvyra.com",
            hashed_password=get_password_hash("admin123"),
            is_admin=True
        )
        db.add(admin)

    # Seed Test User
    user = db.query(User).filter(User.email == "user@zenvyra.com").first()
    if not user:
        user = User(
            email="user@zenvyra.com",
            hashed_password=get_password_hash("user123"),
            is_admin=False
        )
        db.add(user)

    # Seed Products with premium Unsplash images
    products_data = [
        {
            "title": "Zenvyra Core", 
            "description": "The ultimate minimal workspace device.", 
            "price": Decimal("1299.99"), 
            "category": "Devices", 
            "stock": 50,
            "image_url": "/products/core.png"
        },
        {
            "title": "Zenvyra Float Case", 
            "description": "Protective shell with anti-gravity feel.", 
            "price": Decimal("5.99"), 
            "category": "Accessories", 
            "stock": 150,
            "image_url": "/products/cover.png"
        },
        {
            "title": "Zenvyra Aura Lamp", 
            "description": "Smart desk light mapping natural circadian modes.", 
            "price": Decimal("9.99"), 
            "category": "Home", 
            "stock": 30,
            "image_url": "/products/lamp.png"
        },
        {
            "title": "Zenvyra Flow Keyboard", 
            "description": "Mechanical precision with silent linear switches.", 
            "price": Decimal("189.99"), 
            "category": "Peripherals", 
            "stock": 0,
            "image_url": "/products/keyboard.jpg"
        },
        {
            "title": "Zenvyra Arc Mouse", 
            "description": "Ergonomic minimalist pointing device.", 
            "price": Decimal("89.99"), 
            "category": "Peripherals", 
            "stock": 15,
            "image_url": "/products/mouse.png"
        },
        {
            "title": "Zenvyra Desk Mat", 
            "description": "Premium wool-felt smooth glide mat.", 
            "price": Decimal("19.99"), 
            "category": "Accessories", 
            "stock": 100,
            "image_url": "/products/deskmat.png"
        },
        {
            "title": "Zenvyra Sync Dock", 
            "description": "Universal charging hub with invisible magnetic coils.", 
            "price": Decimal("59.99"), 
            "category": "Devices", 
            "stock": 40,
            "image_url": "/products/hub.png"
        },
        {
            "title": "Zenvyra Clean Spray", 
            "description": "Anti-static premium display cleaner.", 
            "price": Decimal("8.99"), 
            "category": "Accessories", 
            "stock": 200,
            "image_url": "/products/spray.png"
        },
    ]

    for p_data in products_data:
        prod = db.query(Product).filter(Product.title == p_data["title"]).first()
        if prod:
            # Update existing products with image URLs and details
            prod.description = p_data["description"]
            prod.price = p_data["price"]
            prod.category = p_data["category"]
            prod.stock = p_data["stock"]
            prod.image_url = p_data["image_url"]
        else:
            # Add new product
            db.add(Product(**p_data))
    
    db.commit()
    db.close()
    print("Database seeding completed.")

if __name__ == "__main__":
    seed_db()
