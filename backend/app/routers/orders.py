from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.security import (
    get_current_user,
    require_admin,
)
from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderStatusUpdate,
)
from app.services.customer_service import (
    get_customer_by_user_id,
)
from app.services.order_service import (
    create_order,
    get_all_orders,
    get_order_by_id,
    get_customer_orders,
    update_order_status,
)


router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


# CREATE ORDER - LOGGED IN CUSTOMER

@router.post(
    "",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED
)
def create_order_endpoint(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    customer = get_customer_by_user_id(
        db,
        current_user.id
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer profile not found"
        )

    try:
        return create_order(
            db,
            order_data,
            customer.id
        )

    except ValueError as error:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )


# GET ALL ORDERS - ADMIN ONLY

@router.get(
    "",
    response_model=list[OrderResponse]
)
def get_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    return get_all_orders(db)


# GET MY ORDERS

@router.get(
    "/my-orders",
    response_model=list[OrderResponse]
)
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    customer = get_customer_by_user_id(
        db,
        current_user.id
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer profile not found"
        )

    return get_customer_orders(
        db,
        customer.id
    )


# GET ORDER BY ID

@router.get(
    "/{order_id}",
    response_model=OrderResponse
)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    order = get_order_by_id(
        db,
        order_id
    )

    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # Admin can view any order
    if current_user.role == UserRole.ADMIN:
        return order

    customer = get_customer_by_user_id(
        db,
        current_user.id
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer profile not found"
        )

    if order.customer_id != customer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot view this order"
        )

    return order


# UPDATE ORDER STATUS - ADMIN ONLY

@router.patch(
    "/{order_id}/status",
    response_model=OrderResponse
)
def update_order_status_endpoint(
    order_id: int,
    status_data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    order = get_order_by_id(
        db,
        order_id
    )

    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    return update_order_status(
        db,
        order,
        status_data.status
    )