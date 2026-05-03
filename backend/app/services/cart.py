from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from pydantic import UUID4
from decimal import Decimal
from app.db.models import Product, CartItem
from app.schemas.domain import CartItemCreate

class CartService:
    def __init__(self, db: Session):
        self.db = db

    def add_to_cart(self, user_id: UUID4, item_in: CartItemCreate) -> CartItem:
        product = self.db.query(Product).filter(Product.id == item_in.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        cart_item = self.db.query(CartItem).filter(
            CartItem.user_id == user_id,
            CartItem.product_id == item_in.product_id
        ).first()

        if cart_item:
            if cart_item.quantity + item_in.quantity > product.stock:
                raise HTTPException(status_code=400, detail="Not enough stock")
            cart_item.quantity += item_in.quantity
        else:
            if item_in.quantity > product.stock:
                raise HTTPException(status_code=400, detail="Not enough stock")
            cart_item = CartItem(
                user_id=user_id,
                product_id=item_in.product_id,
                quantity=item_in.quantity
            )
            self.db.add(cart_item)

        self.db.commit()
        self.db.refresh(cart_item)
        return cart_item

    def get_cart_items(self, user_id: UUID4):
        return self.db.query(CartItem).filter(CartItem.user_id == user_id).all()
        
    def update_cart_item(self, user_id: UUID4, item_id: UUID4, quantity: int) -> CartItem:
        cart_item = self.db.query(CartItem).filter(
            CartItem.id == item_id,
            CartItem.user_id == user_id
        ).first()
        
        if not cart_item:
            raise HTTPException(status_code=404, detail="Cart item not found")
            
        product = self.db.query(Product).filter(Product.id == cart_item.product_id).first()
        if not product or quantity > product.stock:
            raise HTTPException(status_code=400, detail="Not enough stock")
            
        cart_item.quantity = quantity
        self.db.commit()
        self.db.refresh(cart_item)
        return cart_item

    def remove_cart_item(self, user_id: UUID4, item_id: UUID4):
        cart_item = self.db.query(CartItem).filter(
            CartItem.id == item_id,
            CartItem.user_id == user_id
        ).first()
        
        if not cart_item:
            raise HTTPException(status_code=404, detail="Cart item not found")
            
        self.db.delete(cart_item)
        self.db.commit()

    def clear_cart(self, user_id: UUID4):
        self.db.query(CartItem).filter(CartItem.user_id == user_id).delete()
        self.db.commit()
