from typing import Generic, TypeVar, Optional, List, Any
from pydantic import BaseModel

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    message: Optional[str] = None
    
class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    limit: int
    skip: int
