from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field

from app.models.order import OrderStatus
from app.schemas.order_item import (
    OrderItemCreate,
    OrderItemResponse,
)


# ORDER CREATE SCHEMA

class OrderCreate(BaseModel):

    items: list[OrderItemCreate] = Field(
        min_length=1
    )


# ORDER STATUS UPDATE SCHEMA

class OrderStatusUpdate(BaseModel):

    status: OrderStatus


# ORDER RESPONSE SCHEMA

class OrderResponse(BaseModel):

    id: int
    customer_id: int
    total_amount: Decimal
    status: OrderStatus
    created_at: datetime
    order_items: list[OrderItemResponse]

    model_config = {
        "from_attributes": True
    }