from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User
from app.schemas.base import APIResponse
from app.schemas.domain import CartItemCreate, CartItemResponse
from app.services.cart import CartService
from app.api.deps import get_current_user
from typing import List

router = APIRouter()

@router.get("", response_model=APIResponse[List[CartItemResponse]])
def get_cart_items(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cart_service = CartService(db)
    items = cart_service.get_cart_items(user.id)
    return APIResponse(success=True, data=items)

@router.post("/items", response_model=APIResponse[CartItemResponse])
def add_cart_item(item_in: CartItemCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cart_service = CartService(db)
    item = cart_service.add_to_cart(user.id, item_in)
    return APIResponse(success=True, data=item)
