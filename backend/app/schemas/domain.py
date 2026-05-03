from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from decimal import Decimal
from app.db.models import OrderStatus

# User
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: UUID
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Token
class Token(BaseModel):
    access_token: str
    token_type: str

# Product
class ProductBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: Decimal
    image_url: Optional[str] = None
    category: Optional[str] = None
    stock: int = 0

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Cart
class CartItemCreate(BaseModel):
    product_id: UUID
    quantity: int = Field(default=1, gt=0)

class CartItemUpdate(BaseModel):
    quantity: int = Field(gt=0)


class CartItemResponse(BaseModel):
    id: UUID
    quantity: int
    product: ProductResponse
    
    class Config:
        from_attributes = True

# Order
class OrderItemResponse(BaseModel):
    id: UUID
    product: ProductResponse
    quantity: int
    price_at_purchase: Decimal
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: UUID
    total_amount: Decimal
    status: OrderStatus
    razorpay_order_id: Optional[str]
    items: List[OrderItemResponse]
    created_at: datetime
    
    class Config:
        from_attributes = True

class PaymentVerification(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
