from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import (
    Session,
    selectinload,
)

from app.models.food import Food
from app.models.order import Order
from app.models.order_item import OrderItem
from app.schemas.order import OrderCreate


# CREATE ORDER

def create_order(
    db: Session,
    order_data: OrderCreate,
    customer_id: int
) -> Order:

    new_order = Order(
        customer_id=customer_id,
        total_amount=Decimal("0.00")
    )

    db.add(new_order)
    db.flush()

    total_amount = Decimal("0.00")


    for item_data in order_data.items:

        # Get food from database
        food = db.scalar(
            select(Food).where(
                Food.id == item_data.food_id
            )
        )


        # Food does not exist
        if food is None:
            raise ValueError(
                f"Food with ID {item_data.food_id} not found"
            )


        # Food is unavailable
        if not food.is_available:
            raise ValueError(
                f"{food.name} is not available"
            )


        # Calculate subtotal using database price
        subtotal = (
            food.price *
            item_data.quantity
        )


        # Create order item
        order_item = OrderItem(
            order_id=new_order.id,
            food_id=food.id,
            quantity=item_data.quantity,
            unit_price=food.price,
            subtotal=subtotal
        )

        db.add(order_item)


        # Add subtotal to order total
        total_amount += subtotal


    # Save final total
    new_order.total_amount = total_amount


    db.commit()
    db.refresh(new_order)


    # Return complete order
    return get_order_by_id(
        db,
        new_order.id
    )


# GET ORDER BY ID

def get_order_by_id(
    db: Session,
    order_id: int
) -> Order | None:

    return db.scalar(
        select(Order)
        .options(
            selectinload(
                Order.order_items
            ).selectinload(
                OrderItem.food
            )
        )
        .where(
            Order.id == order_id
        )
    )


# GET ALL ORDERS

def get_all_orders(
    db: Session
) -> list[Order]:

    return db.scalars(
        select(Order)
        .options(
            selectinload(
                Order.order_items
            ).selectinload(
                OrderItem.food
            )
        )
        .order_by(
            Order.created_at.desc()
        )
    ).all()


# GET CUSTOMER ORDERS

def get_customer_orders(
    db: Session,
    customer_id: int
) -> list[Order]:

    return db.scalars(
        select(Order)
        .options(
            selectinload(
                Order.order_items
            ).selectinload(
                OrderItem.food
            )
        )
        .where(
            Order.customer_id == customer_id
        )
        .order_by(
            Order.created_at.desc()
        )
    ).all()


# UPDATE ORDER STATUS

def update_order_status(
    db: Session,
    order: Order,
    new_status
) -> Order:

    order.status = new_status

    db.commit()
    db.refresh(order)

    return order