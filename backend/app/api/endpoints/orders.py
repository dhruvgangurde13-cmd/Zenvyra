from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User
from app.schemas.base import APIResponse
from app.schemas.domain import OrderResponse, PaymentVerification
from app.services.order import OrderService
from app.api.deps import get_current_user
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
