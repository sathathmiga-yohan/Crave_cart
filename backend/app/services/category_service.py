from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
)


# CREATE CATEGORY

def create_category(
    db: Session,
    category_data: CategoryCreate
) -> Category:

    new_category = Category(
        name=category_data.name,
        description=category_data.description
    )

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category


# GET ALL CATEGORIES

def get_all_categories(
    db: Session
) -> list[Category]:

    categories = db.scalars(
        select(Category).order_by(Category.name)
    ).all()

    return categories


# GET CATEGORY BY ID

def get_category_by_id(
    db: Session,
    category_id: int
) -> Category | None:

    category = db.scalar(
        select(Category).where(
            Category.id == category_id
        )
    )

    return category


# GET CATEGORY BY NAME

def get_category_by_name(
    db: Session,
    name: str
) -> Category | None:

    category = db.scalar(
        select(Category).where(
            Category.name == name
        )
    )

    return category


# UPDATE CATEGORY

def update_category(
    db: Session,
    category: Category,
    category_data: CategoryUpdate
) -> Category:

    update_data = category_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(category, field, value)

    db.commit()
    db.refresh(category)

    return category


# DELETE CATEGORY

def delete_category(
    db: Session,
    category: Category
) -> None:

    db.delete(category)
    db.commit()