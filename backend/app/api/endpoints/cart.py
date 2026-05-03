from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User
from app.schemas.base import APIResponse
from app.schemas.domain import CartItemCreate, CartItemResponse, CartItemUpdate
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
@router.put("/items/{item_id}", response_model=APIResponse[CartItemResponse])
def update_cart_item(item_id: str, item_in: CartItemUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from pydantic import UUID4
    try:
        import uuid
        uuid_obj = uuid.UUID(item_id)
    except ValueError:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Cart item not found")
        
    cart_service = CartService(db)
    item = cart_service.update_cart_item(user.id, uuid_obj, item_in.quantity)
    return APIResponse(success=True, data=item)

@router.delete("/items/{item_id}", response_model=APIResponse[dict])
def remove_cart_item(item_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from pydantic import UUID4
    try:
        import uuid
        uuid_obj = uuid.UUID(item_id)
    except ValueError:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Cart item not found")
        
    cart_service = CartService(db)
    cart_service.remove_cart_item(user.id, uuid_obj)
    return APIResponse(success=True, data={"message": "Item removed"})
