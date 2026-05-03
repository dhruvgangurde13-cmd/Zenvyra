from sqlalchemy.orm import Session
from fastapi import HTTPException
from pydantic import UUID4
from app.db.models import Product
from app.schemas.domain import ProductCreate

class ProductService:
    def __init__(self, db: Session):
        self.db = db
        
    def create_product(self, product_in: ProductCreate) -> Product:
        product = Product(**product_in.model_dump())
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product
        
    def get_products(self, skip: int = 0, limit: int = 20):
        return self.db.query(Product).offset(skip).limit(limit).all()
        
    def get_total_products(self) -> int:
        return self.db.query(Product).count()
