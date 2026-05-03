from sqlalchemy.orm import Session
from fastapi import HTTPException
from pydantic import UUID4
from app.db.models import Product
from app.schemas.domain import ProductCreate, ProductUpdate

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

    def get_product_by_id(self, product_id: UUID4) -> Product:
        product = self.db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    def update_product(self, product_id: UUID4, product_in: ProductUpdate) -> Product:
        product = self.get_product_by_id(product_id)
        update_data = product_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(product, key, value)
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product

    def delete_product(self, product_id: UUID4):
        product = self.get_product_by_id(product_id)
        self.db.delete(product)
        self.db.commit()
        return True

