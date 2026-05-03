from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.base import APIResponse, PaginatedResponse
from app.schemas.domain import ProductResponse, ProductCreate
from app.services.product import ProductService
from app.api.deps import get_current_admin

router = APIRouter()

@router.get("", response_model=APIResponse[PaginatedResponse[ProductResponse]])
def get_products(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    product_service = ProductService(db)
    products = product_service.get_products(skip=skip, limit=limit)
    total = product_service.get_total_products()
    return APIResponse(
        success=True,
        data=PaginatedResponse(items=products, total=total, limit=limit, skip=skip)
    )

@router.post("", response_model=APIResponse[ProductResponse])
def create_product(product_in: ProductCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    product_service = ProductService(db)
    product = product_service.create_product(product_in)
    return APIResponse(success=True, data=product)

@router.get("/{product_id}", response_model=APIResponse[ProductResponse])
def get_product(product_id: str, db: Session = Depends(get_db)):
    from pydantic import UUID4
    try:
        import uuid
        uuid_obj = uuid.UUID(product_id)
    except ValueError:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
        
    product_service = ProductService(db)
    product = product_service.get_product_by_id(product_id)
    return APIResponse(success=True, data=product)

