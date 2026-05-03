from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.models import User
from app.schemas.domain import UserCreate
from app.core.security import get_password_hash

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        
    def create_user(self, user_in: UserCreate) -> User:
        user = self.db.query(User).filter(User.email == user_in.email).first()
        if user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        
        hashed_password = get_password_hash(user_in.password)
        db_user = User(
            email=user_in.email,
            hashed_password=hashed_password,
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
