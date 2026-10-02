from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import (
    CustomerCreate,
    CustomerUpdate,
)


# CREATE CUSTOMER

def create_customer(
    db: Session,
    customer_data: CustomerCreate,
    user_id: int
) -> Customer:

    new_customer = Customer(
        user_id=user_id,
        name=customer_data.name,
        email=customer_data.email,
        phone=customer_data.phone,
        address=customer_data.address
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


# GET ALL CUSTOMERS

def get_all_customers(
    db: Session
) -> list[Customer]:

    return db.scalars(
        select(Customer).order_by(Customer.name)
    ).all()


# GET CUSTOMER BY ID

def get_customer_by_id(
    db: Session,
    customer_id: int
) -> Customer | None:

    return db.scalar(
        select(Customer).where(
            Customer.id == customer_id
        )
    )


# GET CUSTOMER BY USER ID

def get_customer_by_user_id(
    db: Session,
    user_id: int
) -> Customer | None:

    return db.scalar(
        select(Customer).where(
            Customer.user_id == user_id
        )
    )


# GET CUSTOMER BY EMAIL

def get_customer_by_email(
    db: Session,
    email: str
) -> Customer | None:

    return db.scalar(
        select(Customer).where(
            Customer.email == email
        )
    )


# UPDATE CUSTOMER

def update_customer(
    db: Session,
    customer: Customer,
    customer_data: CustomerUpdate
) -> Customer:

    update_data = customer_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(customer, field, value)

    db.commit()
    db.refresh(customer)

    return customer


# DELETE CUSTOMER

def delete_customer(
    db: Session,
    customer: Customer
) -> None:

    db.delete(customer)
    db.commit()