from pydantic import BaseModel, EmailStr, Field


# CUSTOMER CREATE SCHEMA

class CustomerCreate(BaseModel):

    name: str = Field(
        min_length=2,
        max_length=100
    )

    email: EmailStr

    phone: str = Field(
        min_length=5,
        max_length=20
    )

    address: str = Field(
        min_length=5,
        max_length=500
    )


# CUSTOMER UPDATE SCHEMA

class CustomerUpdate(BaseModel):

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    email: EmailStr | None = None

    phone: str | None = Field(
        default=None,
        min_length=5,
        max_length=20
    )

    address: str | None = Field(
        default=None,
        min_length=5,
        max_length=500
    )


# CUSTOMER RESPONSE SCHEMA

class CustomerResponse(BaseModel):

    id: int
    user_id: int
    name: str
    email: EmailStr
    phone: str
    address: str

    model_config = {
        "from_attributes": True
    }