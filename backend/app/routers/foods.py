from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.auth.security import require_admin
from app.database import get_db
from app.models.user import User
from app.schemas.food import (
    FoodCreate,
    FoodUpdate,
    FoodResponse,
)
from app.services.category_service import get_category_by_id
from app.services.food_service import (
    create_food,
    get_all_foods,
    get_food_by_id,
    update_food,
    delete_food,
)


router = APIRouter(
    prefix="/foods",
    tags=["Foods"]
)


# IMAGE UPLOAD SETTINGS

UPLOAD_DIR = Path("uploads/foods")

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


# CREATE FOOD - ADMIN ONLY

@router.post(
    "",
    response_model=FoodResponse,
    status_code=status.HTTP_201_CREATED
)
def create_food_endpoint(
    food_data: FoodCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    category = get_category_by_id(
        db,
        food_data.category_id
    )

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    return create_food(
        db,
        food_data
    )


# GET ALL FOODS

@router.get(
    "",
    response_model=list[FoodResponse]
)
def get_foods(
    search: str | None = None,
    category_id: int | None = None,
    is_available: bool | None = None,
    sort: str = "name",
    order: str = "asc",
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):

    return get_all_foods(
        db=db,
        search=search,
        category_id=category_id,
        is_available=is_available,
        sort=sort,
        order=order,
        page=page,
        limit=limit
    )


# UPLOAD FOOD IMAGE - ADMIN ONLY

@router.post(
    "/{food_id}/image",
    response_model=FoodResponse
)
def upload_food_image(
    food_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    # Check food exists
    food = get_food_by_id(
        db,
        food_id
    )

    if food is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food not found"
        )

    # Check image type
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG and WEBP images are allowed"
        )

    # Get image extension
    extension = Path(
        image.filename or ""
    ).suffix.lower()

    # Create unique image name
    filename = f"{uuid4().hex}{extension}"

    # Full image save path
    file_path = UPLOAD_DIR / filename

    # Save uploaded image
    with open(file_path, "wb") as file:
        file.write(
            image.file.read()
        )

    # Save image URL/path in database
    food.image = f"/uploads/foods/{filename}"

    db.commit()
    db.refresh(food)

    return food


# GET FOOD BY ID

@router.get(
    "/{food_id}",
    response_model=FoodResponse
)
def get_food(
    food_id: int,
    db: Session = Depends(get_db)
):

    food = get_food_by_id(
        db,
        food_id
    )

    if food is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food not found"
        )

    return food


# UPDATE FOOD - ADMIN ONLY

@router.patch(
    "/{food_id}",
    response_model=FoodResponse
)
def update_food_endpoint(
    food_id: int,
    food_data: FoodUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    food = get_food_by_id(
        db,
        food_id
    )

    if food is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food not found"
        )

    # If category is changed, check that category exists
    if food_data.category_id is not None:

        category = get_category_by_id(
            db,
            food_data.category_id
        )

        if category is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )

    return update_food(
        db,
        food,
        food_data
    )


# DELETE FOOD - ADMIN ONLY

@router.delete(
    "/{food_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_food_endpoint(
    food_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    food = get_food_by_id(
        db,
        food_id
    )

    if food is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food not found"
        )

    delete_food(
        db,
        food
    )