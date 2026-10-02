from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.security import require_admin
from app.database import get_db
from app.models.user import User
from app.services.dashboard_service import (
    get_dashboard_statistics,
    get_popular_foods,
)


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# ADMIN DASHBOARD STATISTICS

@router.get("/statistics")
def dashboard_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    return get_dashboard_statistics(db)


# POPULAR FOODS

@router.get("/popular-foods")
def popular_foods(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    return get_popular_foods(db)