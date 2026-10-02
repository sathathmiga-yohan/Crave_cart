from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.food import Food
from app.schemas.food import (
    FoodCreate,
    FoodUpdate,
)


# CREATE FOOD

def create_food(
    db: Session,
    food_data: FoodCreate
) -> Food:

    new_food = Food(
        name=food_data.name,
        description=food_data.description,
        price=food_data.price,
        image=food_data.image,
        is_available=food_data.is_available,
        category_id=food_data.category_id
    )

    db.add(new_food)
    db.commit()
    db.refresh(new_food)

    return new_food


def get_all_foods(
    db: Session,
    search: str | None = None,
    category_id: int | None = None,
    is_available: bool | None = None,
    sort: str = "name",
    order: str = "asc",
    page: int = 1,
    limit: int = 10
) -> list[Food]:

    query = select(Food)

    # SEARCH BY FOOD NAME
    if search:
        query = query.where(
            Food.name.ilike(f"%{search}%")
        )

    # FILTER BY CATEGORY
    if category_id is not None:
        query = query.where(
            Food.category_id == category_id
        )

    # FILTER BY AVAILABILITY
    if is_available is not None:
        query = query.where(
            Food.is_available == is_available
        )

    # SORTING
    if sort == "price":
        sort_column = Food.price
    else:
        sort_column = Food.name

    if order == "desc":
        query = query.order_by(
            sort_column.desc()
        )
    else:
        query = query.order_by(
            sort_column.asc()
        )

    # PAGINATION
    offset = (page - 1) * limit

    query = query.offset(
        offset
    ).limit(
        limit
    )

    return db.scalars(query).all()


# GET FOOD BY ID

def get_food_by_id(
    db: Session,
    food_id: int
) -> Food | None:

    food = db.scalar(
        select(Food).where(
            Food.id == food_id
        )
    )

    return food


# UPDATE FOOD

def update_food(
    db: Session,
    food: Food,
    food_data: FoodUpdate
) -> Food:

    update_data = food_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(food, field, value)

    db.commit()
    db.refresh(food)

    return food


# DELETE FOOD

def delete_food(
    db: Session,
    food: Food
) -> None:

    db.delete(food)
    db.commit()