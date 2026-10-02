from decimal import Decimal

from pydantic import BaseModel, Field


# FOOD CREATE SCHEMA

class FoodCreate(BaseModel):

    name: str = Field(
        min_length=2,
        max_length=150
    )

    description: str | None = None

    price: Decimal = Field(
        gt=0
    )

    image: str | None = Field(
        default=None,
        max_length=500
    )

    is_available: bool = True

    category_id: int = Field(
        gt=0
    )


# FOOD UPDATE SCHEMA

class FoodUpdate(BaseModel):

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=150
    )

    description: str | None = None

    price: Decimal | None = Field(
        default=None,
        gt=0
    )

    image: str | None = Field(
        default=None,
        max_length=500
    )

    is_available: bool | None = None

    category_id: int | None = Field(
        default=None,
        gt=0
    )


# FOOD RESPONSE SCHEMA

class FoodResponse(BaseModel):

    id: int
    name: str
    description: str | None
    price: Decimal
    image: str | None
    is_available: bool
    category_id: int

    model_config = {
        "from_attributes": True
    }