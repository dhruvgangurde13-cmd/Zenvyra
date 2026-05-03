import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000/api/v1"

def print_step(step):
    print(f"\n{'='*50}\n[STEP] {step}\n{'='*50}")

def run_tests():
    session = requests.Session()
    
    # 1. Auth: Register and Login
    print_step("1. Auth - Register and Login")
    email = f"testuser_{int(time.time())}@example.com"
    pwd = "testpassword123"
    
    # Register
    res = session.post(f"{BASE_URL}/auth/register", json={
        "email": email,
        "password": pwd,
        "full_name": "Test User"
    })
    print("Register Response Status:", res.status_code)
    try:
        print("Register Response JSON:", json.dumps(res.json(), indent=2))
        assert res.status_code == 200
        assert res.json()["success"] is True
    except Exception as e:
        print("Failed to register or parse response:", res.text)
        return
        
    # Login
    res = session.post(f"{BASE_URL}/auth/login", data={
        "username": email,
        "password": pwd
    })
    print("\nLogin Response Status:", res.status_code)
    try:
        token_data = res.json()
        print("Login Response JSON:", json.dumps(token_data, indent=2))
        token = token_data["access_token"]
        session.headers.update({"Authorization": f"Bearer {token}"})
    except Exception as e:
        print("Failed to login or parse response:", res.text)
        return

    # 2. Get Products
    print_step("2. Products - List and Select")
    res = session.get(f"{BASE_URL}/products/")
    print("Products Response Status:", res.status_code)
    try:
        products_data = res.json()
        assert products_data["success"] is True
        products = products_data["data"]["items"]
        print(f"Found {len(products)} products")
        if not products:
            print("No products found! Please seed the DB.")
            return
            
        product = products[0]
        product_id = product["id"]
        initial_stock = product["stock"]
        print(f"Selected Product: {product['name']} (ID: {product_id}), Stock: {initial_stock}")
    except Exception as e:
        print("Failed to get products:", res.text)
        return

    # 3. Cart - Add item
    print_step("3. Cart - Add Item")
    qty_to_add = 2
    res = session.post(f"{BASE_URL}/cart/items", json={
        "product_id": product_id,
        "quantity": qty_to_add
    })
    print("Add to Cart Status:", res.status_code)
    try:
        print("Cart Item JSON:", json.dumps(res.json(), indent=2))
        assert res.status_code == 200
        assert res.json()["success"] is True
    except Exception as e:
        print("Failed to add to cart:", res.text)
        return

    # 4. Checkout - Create Order
    print_step("4. Checkout - Create Order")
    res = session.post(f"{BASE_URL}/orders/checkout")
    print("Checkout Status:", res.status_code)
    try:
        order_data = res.json()
        print("Order JSON:", json.dumps(order_data, indent=2))
        assert order_data["success"] is True
        order_id = order_data["data"]["id"]
    except Exception as e:
        print("Failed to checkout:", res.text)
        return

    # 5. Verify Payment
    print_step("5. Order - Verify Payment and Check Stock Reduction")
    res = session.post(f"{BASE_URL}/orders/{order_id}/verify", json={
        "razorpay_payment_id": "pay_fake_12345",
        "razorpay_order_id": order_data["data"]["razorpay_order_id"],
        "razorpay_signature": "fake_signature"
    })
    print("Verify Payment Status:", res.status_code)
    try:
        verification_data = res.json()
        print("Verification JSON:", json.dumps(verification_data, indent=2))
        assert verification_data["success"] is True
        assert verification_data["data"]["status"] == "COMPLETED"
    except Exception as e:
        print("Failed to verify payment:", res.text)
        return

    # 6. Verify Stock Reduction
    print("\nVerifying Stock Reduction...")
    res = session.get(f"{BASE_URL}/products/")
    updated_products = res.json()["data"]["items"]
    updated_product = next(p for p in updated_products if p["id"] == product_id)
    updated_stock = updated_product["stock"]
    
    print(f"Initial Stock: {initial_stock}")
    print(f"Purchased Qty: {qty_to_add}")
    print(f"Updated Stock: {updated_stock}")
    
    if updated_stock == initial_stock - qty_to_add:
        print("\nSUCCESS: Stock reduction is correct!")
    else:
        print("\nERROR: Stock reduction failed or is incorrect!")

if __name__ == "__main__":
    try:
        requests.get(BASE_URL + "/health")
        print("Backend is accessible. Running tests...")
        run_tests()
    except Exception as e:
        print(f"Backend is not accessible at {BASE_URL}. Error: {e}")
