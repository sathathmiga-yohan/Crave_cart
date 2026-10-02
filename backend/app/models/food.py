from decimal import Decimal

from sqlalchemy import Boolean, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


# FOOD MODEL

class Food(Base):

    __tablename__ = "foods"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )

    image: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    is_available: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"),
        nullable=False,
        index=True
    )

    # RELATIONSHIP

    category: Mapped["Category"] = relationship(
        "Category",
        back_populates="foods"
    )

    order_items: Mapped[list["OrderItem"]] = relationship(
    "OrderItem",
    back_populates="food"
    )