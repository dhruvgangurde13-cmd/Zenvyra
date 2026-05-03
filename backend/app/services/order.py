from sqlalchemy.orm import Session
from fastapi import HTTPException
from pydantic import UUID4
import uuid
from decimal import Decimal
from app.db.models import Order, OrderItem, CartItem, Product, OrderStatus
from app.schemas.domain import PaymentVerification
from app.services.cart import CartService

class OrderService:
    def __init__(self, db: Session):
        self.db = db
        self.cart_service = CartService(db)

    def create_order(self, user_id: UUID4) -> Order:
        cart_items = self.cart_service.get_cart_items(user_id)
        if not cart_items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        total_amount = Decimal('0.00')
        order_items = []
        
        for item in cart_items:
            # Check stock again to be absolutely sure
            if item.quantity > item.product.stock:
                raise HTTPException(status_code=400, detail=f"Not enough stock for {item.product.title}")
            
            total_amount += (item.product.price * item.quantity)
            order_items.append(
                OrderItem(
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price_at_purchase=item.product.price
                )
            )

        order = Order(
            user_id=user_id,
            total_amount=total_amount,
            status=OrderStatus.PENDING,
            # dummy razorpay generation
            razorpay_order_id=f"order_sim_{uuid.uuid4().hex[:10]}"
        )
        self.db.add(order)
        self.db.commit()
        self.db.refresh(order)

        for oi in order_items:
            oi.order_id = order.id
            self.db.add(oi)

        self.db.commit()
        self.db.refresh(order)
        return order

    def verify_payment(self, user_id: UUID4, order_id: UUID4, verification: PaymentVerification) -> Order:
        order = self.db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if order.status == OrderStatus.PAID:
            raise HTTPException(status_code=400, detail="Order already paid")

        # Mock verification logic: Always succeed in mockup mode
        order.status = OrderStatus.PAID
        order.razorpay_payment_id = verification.razorpay_payment_id
        order.razorpay_signature = verification.razorpay_signature
        
        # Atomic Product stock reduction
        for item in order.items:
            product = self.db.query(Product).filter(Product.id == item.product_id).with_for_update().first()
            if product:
                product.stock -= item.quantity
                if product.stock < 0:
                    product.stock = 0

        self.cart_service.clear_cart(user_id)
        self.db.commit()
        self.db.refresh(order)
        return order
