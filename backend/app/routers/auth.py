from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.user import (
    TokenResponse,
    UserCreate,
    UserResponse,
)

from app.auth.security import get_current_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# REGISTER USER

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):

    # Check whether the email is already registered
    existing_user = db.scalar(
        select(User).where(
            User.email == user_data.email
        )
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Create a new customer account
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(
            user_data.password
        ),
        role=UserRole.CUSTOMER
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# LOGIN USER

@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    # OAuth2 uses the field name "username".
    # In this project, the username field contains the user's email.
    user = db.scalar(
        select(User).where(
            User.email == form_data.username
        )
    )

    # Check email and password
    if user is None or not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Check whether the account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    # Create JWT access token
    access_token = create_access_token(
        user_id=user.id
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer"
    )

    # GET CURRENT LOGGED-IN USER

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user