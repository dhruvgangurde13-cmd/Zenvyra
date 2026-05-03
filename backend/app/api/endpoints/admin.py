from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, Product
from app.schemas.base import APIResponse
from app.schemas.domain import AdminStatsResponse
from app.api.deps import get_current_admin
from app.services.order import OrderService

router = APIRouter()

@router.get("/stats", response_model=APIResponse[AdminStatsResponse])
def get_admin_stats(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    total_users = db.query(User).count()
    total_products = db.query(Product).count()
    low_stock_products = db.query(Product).filter(Product.stock < 10).count()
    
    order_service = OrderService(db)
    total_orders = order_service.get_total_orders()
    total_revenue = order_service.get_total_revenue()
    
    stats = AdminStatsResponse(
        total_users=total_users,
        total_orders=total_orders,
        total_products=total_products,
        total_revenue=total_revenue,
        low_stock_products=low_stock_products
    )
    
    return APIResponse(success=True, data=stats)
