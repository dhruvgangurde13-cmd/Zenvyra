from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.db.database import get_db
from app.db.models import User
from app.schemas.base import APIResponse
from app.schemas.domain import UserCreate, UserResponse, Token
from app.services.auth import AuthService
from app.core.config import settings
from app.core.security import verify_password, create_access_token
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=APIResponse[UserResponse])
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user = auth_service.create_user(user_in)
    return APIResponse(success=True, data=user)

@router.post("/login", response_model=APIResponse[Token])
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return APIResponse(success=True, data=Token(access_token=access_token, token_type="bearer"))

@router.get("/me", response_model=APIResponse[UserResponse])
def read_users_me(current_user: User = Depends(get_current_user)):
    return APIResponse(success=True, data=current_user)
