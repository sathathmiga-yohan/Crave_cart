from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.security import require_admin
from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    UserResponse,
    UserStatusUpdate,
)
from app.services.user_service import (
    get_all_users,
    get_user_by_id,
    update_user_status,
)


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# GET ALL USERS

@router.get(
    "",
    response_model=list[UserResponse]
)
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    return get_all_users(db)


# UPDATE USER STATUS

@router.patch(
    "/{user_id}/status",
    response_model=UserResponse
)
def change_user_status(
    user_id: int,
    status_data: UserStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    user = get_user_by_id(
        db,
        user_id
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return update_user_status(
        db,
        user,
        status_data.is_active
    )