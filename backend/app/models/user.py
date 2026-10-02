# - datetime → current date + time எடுக்க
# - timezone → backend-ல் UTC time use பண்ண
from datetime import datetime, timezone

# குறிப்பிட்ட values மட்டும் allow பண்ண
from enum import Enum

# Database column types
from sqlalchemy import Boolean, DateTime, Enum as SQLEnum, Integer, String

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


# USER ROLE

class UserRole(str, Enum):
    CUSTOMER = "CUSTOMER"
    ADMIN = "ADMIN"


# USER MODEL

class User(Base):

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole),
        default=UserRole.CUSTOMER,
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # RELATIONSHIP

    customer: Mapped["Customer | None"] = relationship(
        "Customer",
        back_populates="user",
        uselist=False
    )