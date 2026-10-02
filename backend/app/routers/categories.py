from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.security import require_admin
from app.database import get_db
from app.models.user import User
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
)
from app.services.category_service import (
    create_category,
    get_all_categories,
    get_category_by_id,
    get_category_by_name,
    update_category,
    delete_category,
)


router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)


# CREATE CATEGORY - ADMIN ONLY

@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED
)
def create_category_endpoint(
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    existing_category = get_category_by_name(
        db,
        category_data.name
    )

    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Category already exists"
        )

    return create_category(
        db,
        category_data
    )


# GET ALL CATEGORIES

@router.get(
    "",
    response_model=list[CategoryResponse]
)
def get_categories(
    db: Session = Depends(get_db)
):

    return get_all_categories(db)


# GET CATEGORY BY ID

@router.get(
    "/{category_id}",
    response_model=CategoryResponse
)
def get_category(
    category_id: int,
    db: Session = Depends(get_db)
):

    category = get_category_by_id(
        db,
        category_id
    )

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    return category


# UPDATE CATEGORY - ADMIN ONLY

@router.patch(
    "/{category_id}",
    response_model=CategoryResponse
)
def update_category_endpoint(
    category_id: int,
    category_data: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    category = get_category_by_id(
        db,
        category_id
    )

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    if category_data.name is not None:

        existing_category = get_category_by_name(
            db,
            category_data.name
        )

        if (
            existing_category
            and existing_category.id != category.id
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Category name already exists"
            )

    return update_category(
        db,
        category,
        category_data
    )


# DELETE CATEGORY - ADMIN ONLY

@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_category_endpoint(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    category = get_category_by_id(
        db,
        category_id
    )

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    delete_category(
        db,
        category
    )