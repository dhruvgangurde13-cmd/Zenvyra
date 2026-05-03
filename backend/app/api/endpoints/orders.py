from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User
from app.schemas.base import APIResponse
from app.schemas.domain import OrderResponse, PaymentVerification
from app.services.order import OrderService
from app.api.deps import get_current_user, get_current_admin
from pydantic import UUID4

router = APIRouter()

@router.post("/checkout", response_model=APIResponse[OrderResponse])
def checkout_cart(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    order_service = OrderService(db)
    order = order_service.create_order(user.id)
    return APIResponse(success=True, data=order)

@router.post("/{order_id}/verify", response_model=APIResponse[OrderResponse])
def verify_payment(
    order_id: UUID4,
    verification: PaymentVerification,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    order_service = OrderService(db)
    order = order_service.verify_payment(user.id, order_id, verification)
    return APIResponse(success=True, data=order)

@router.get('/admin/all', response_model=APIResponse[List[OrderResponse]])
def get_all_orders(skip: int = 0, limit: int = 50, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    order_service = OrderService(db)
    orders = order_service.get_all_orders(skip, limit)
    return APIResponse(success=True, data=orders)

@router.get('', response_model=APIResponse[List[OrderResponse]])
def get_orders(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    order_service = OrderService(db)
    orders = order_service.get_user_orders(user.id)
    return APIResponse(success=True, data=orders)
