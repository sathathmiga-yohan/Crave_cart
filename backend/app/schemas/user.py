from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole

# USER CREATE SCHEMA

class UserCreate(BaseModel):

    name: str = Field(
        min_length=2,
        max_length=100
    )

    email: EmailStr

    password: str = Field(
        min_length=6,
        max_length=100
    )


# USER RESPONSE SCHEMA

class UserResponse(BaseModel):

    id: int
    name: str
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

# TOKEN RESPONSE SCHEMA

class TokenResponse(BaseModel):

    access_token: str
    token_type: str

class UserStatusUpdate(BaseModel):
    is_active: bool