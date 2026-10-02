from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


# ORDER ITEM MODEL

class OrderItem(Base):

    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id"),
        nullable=False,
        index=True
    )

    food_id: Mapped[int] = mapped_column(
        ForeignKey("foods.id"),
        nullable=False,
        index=True
    )

    quantity: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    unit_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )

    subtotal: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )

    # RELATIONSHIPS

    order: Mapped["Order"] = relationship(
        "Order",
        back_populates="order_items"
    )

    food: Mapped["Food"] = relationship(
        "Food",
        back_populates="order_items"
    )