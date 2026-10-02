from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.security import (
    get_current_user,
    require_admin,
)
from app.database import get_db
from app.models.user import User
from app.schemas.customer import (
    CustomerCreate,
    CustomerUpdate,
    CustomerResponse,
)
from app.services.customer_service import (
    create_customer,
    get_all_customers,
    get_customer_by_id,
    get_customer_by_user_id,
    get_customer_by_email,
    update_customer,
    delete_customer,
)


router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


# CREATE CUSTOMER - LOGGED IN USER

@router.post(
    "",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED
)
def create_customer_endpoint(
    customer_data: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    existing_customer = get_customer_by_user_id(
        db,
        current_user.id
    )

    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Customer profile already exists"
        )

    existing_email = get_customer_by_email(
        db,
        customer_data.email
    )

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Customer email already exists"
        )

    return create_customer(
        db,
        customer_data,
        current_user.id
    )


# GET MY CUSTOMER PROFILE

@router.get(
    "/me",
    response_model=CustomerResponse
)
def get_my_customer(
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

    return customer


# GET ALL CUSTOMERS - ADMIN ONLY

@router.get(
    "",
    response_model=list[CustomerResponse]
)
def get_customers(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    return get_all_customers(db)


# GET CUSTOMER BY ID - ADMIN ONLY

@router.get(
    "/{customer_id}",
    response_model=CustomerResponse
)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    customer = get_customer_by_id(
        db,
        customer_id
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )

    return customer


# UPDATE MY CUSTOMER PROFILE

@router.patch(
    "/me",
    response_model=CustomerResponse
)
def update_my_customer(
    customer_data: CustomerUpdate,
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

    return update_customer(
        db,
        customer,
        customer_data
    )


# DELETE CUSTOMER - ADMIN ONLY

@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_customer_endpoint(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    customer = get_customer_by_id(
        db,
        customer_id
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )

    delete_customer(
        db,
        customer
    )