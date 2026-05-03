import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from decimal import Decimal

from app.main import app
from app.db.database import Base, get_db
from app.db.models import User, Product, OrderStatus

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Add a product
    product = Product(
        title="Test Zenvyra Core",
        description="Test Desc",
        price=Decimal("299.99"),
        stock=5
    )
    db.add(product)
    db.commit()
    yield
    Base.metadata.drop_all(bind=engine)

def test_full_flow():
    # 1. Register User
    res = client.post("/api/auth/register", json={
        "email": "tester@zenvyra.com",
        "password": "password123"
    })
    assert res.status_code == 200, res.text
    assert res.json()["success"] == True
    
    # 2. Login User
    res = client.post("/api/auth/login", data={
        "username": "tester@zenvyra.com",
        "password": "password123"
    })
    assert res.status_code == 200, res.text
    token = res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Get Products
    res = client.get("/api/products")
    assert res.status_code == 200, res.text
    products = res.json()["data"]["items"]
    assert len(products) > 0
    product_id = products[0]["id"]
    initial_stock = products[0]["stock"]
    
    # 4. Add to Cart
    res = client.post("/api/cart/items", json={
        "product_id": product_id,
        "quantity": 2
    }, headers=headers)
    assert res.status_code == 200, res.text
    assert res.json()["data"]["quantity"] == 2
    
    # 5. Checkout Cart
    res = client.post("/api/orders/checkout", headers=headers)
    assert res.status_code == 200, res.text
    order_data = res.json()["data"]
    order_id = order_data["id"]
    razorpay_order_id = order_data["razorpay_order_id"]
    assert order_data["status"] == "pending"
    assert len(order_data["items"]) == 1
    
    # 6. Verify Payment
    res = client.post(f"/api/orders/{order_id}/verify", json={
        "razorpay_order_id": razorpay_order_id,
        "razorpay_payment_id": "pay_test_succ",
        "razorpay_signature": "signature_test"
    }, headers=headers)
    assert res.status_code == 200, res.text
    assert res.json()["data"]["status"] == "paid"
    
    # 7. Check Cart is Empty
    res = client.get("/api/cart", headers=headers)
    assert res.status_code == 200, res.text
    assert len(res.json()["data"]) == 0
    
    # 8. Check Stock is reduced
    res = client.get("/api/products")
    assert res.status_code == 200, res.text
    updated_products = res.json()["data"]["items"]
    updated_stock = updated_products[0]["stock"]
    assert updated_stock == initial_stock - 2

def test_unauthenticated_cart_access():
    res = client.get("/api/cart")
    assert res.status_code == 401

def test_overstock_cart_addition():
    # Login again
    res = client.post("/api/auth/login", data={
        "username": "tester@zenvyra.com",
        "password": "password123"
    })
    token = res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    res = client.get("/api/products")
    product_id = res.json()["data"]["items"][0]["id"]
    
    # Try adding more than available stock (now stock is 5 - 2 = 3)
    res = client.post("/api/cart/items", json={
        "product_id": product_id,
        "quantity": 10
    }, headers=headers)
    assert res.status_code == 400
    assert "stock" in res.json()["detail"].lower()
