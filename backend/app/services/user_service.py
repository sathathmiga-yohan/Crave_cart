from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


# GET ALL USERS

def get_all_users(
    db: Session
) -> list[User]:

    return db.scalars(
        select(User).order_by(User.created_at.desc())
    ).all()


# GET USER BY ID

def get_user_by_id(
    db: Session,
    user_id: int
) -> User | None:

    return db.scalar(
        select(User).where(
            User.id == user_id
        )
    )


# UPDATE USER ACTIVE STATUS

def update_user_status(
    db: Session,
    user: User,
    is_active: bool
) -> User:

    user.is_active = is_active

    db.commit()
    db.refresh(user)

    return user