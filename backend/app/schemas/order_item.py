from decimal import Decimal

from pydantic import BaseModel, Field


# ORDER ITEM CREATE SCHEMA

class OrderItemCreate(BaseModel):

    food_id: int = Field(
        gt=0
    )

    quantity: int = Field(
        ge=1
    )


# ORDER ITEM FOOD RESPONSE

class OrderItemFoodResponse(BaseModel):

    id: int
    name: str

    model_config = {
        "from_attributes": True
    }


# ORDER ITEM RESPONSE SCHEMA

class OrderItemResponse(BaseModel):

    id: int
    food_id: int
    quantity: int
    unit_price: Decimal
    subtotal: Decimal

    food: OrderItemFoodResponse

    model_config = {
        "from_attributes": True
    }