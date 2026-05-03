import os
import sys

# Add the backend directory to sys.path so app can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from decimal import Decimal
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

    # Seed Products
    if db.query(Product).count() == 0:
        products = [
            Product(title="Zenvyra Core", description="The ultimate minimal workspace device.", price=Decimal("299.99"), category="Devices", stock=50),
            Product(title="Zenvyra Float Case", description="Protective shell with anti-gravity feel.", price=Decimal("49.99"), category="Accessories", stock=150),
            Product(title="Zenvyra Aura Lamp", description="Smart desk light mapping natural circadian modes.", price=Decimal("129.99"), category="Home", stock=30),
            Product(title="Zenvyra Flow Keyboard", description="Mechanical precision with silent linear switches.", price=Decimal("189.99"), category="Peripherals", stock=0), # Out of stock item
            Product(title="Zenvyra Arc Mouse", description="Ergonomic minimalist pointing device.", price=Decimal("89.99"), category="Peripherals", stock=15),
            Product(title="Zenvyra Desk Mat", description="Premium wool-felt smooth glide mat.", price=Decimal("39.99"), category="Accessories", stock=100),
            Product(title="Zenvyra Sync Dock", description="Universal charging hub with invisible magnetic coils.", price=Decimal("79.99"), category="Devices", stock=40),
            Product(title="Zenvyra Clean Spray", description="Anti-static premium display cleaner.", price=Decimal("24.99"), category="Accessories", stock=200),
        ]
        db.add_all(products)
    
    db.commit()
    db.close()
    print("Database seeding completed.")

if __name__ == "__main__":
    seed_db()
