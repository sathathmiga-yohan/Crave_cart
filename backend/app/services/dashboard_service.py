from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.customer import Customer
from app.models.food import Food
from app.models.order import Order, OrderStatus
from app.models.order_item import OrderItem


# GET DASHBOARD STATISTICS

def get_dashboard_statistics(
    db: Session
):

    total_foods = db.scalar(
        select(func.count(Food.id))
    ) or 0

    total_categories = db.scalar(
        select(func.count(Category.id))
    ) or 0

    total_customers = db.scalar(
        select(func.count(Customer.id))
    ) or 0

    total_orders = db.scalar(
        select(func.count(Order.id))
    ) or 0

    total_revenue = db.scalar(
        select(func.sum(Order.total_amount))
        .where(
            Order.status == OrderStatus.DELIVERED
        )
    ) or 0

    pending_orders = db.scalar(
        select(func.count(Order.id))
        .where(
            Order.status == OrderStatus.PENDING
        )
    ) or 0

    delivered_orders = db.scalar(
        select(func.count(Order.id))
        .where(
            Order.status == OrderStatus.DELIVERED
        )
    ) or 0

    return {
        "total_foods": total_foods,
        "total_categories": total_categories,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "pending_orders": pending_orders,
        "delivered_orders": delivered_orders
    }


# GET POPULAR FOODS

def get_popular_foods(
    db: Session
):

    results = db.execute(
        select(
            Food.id,
            Food.name,
            func.sum(
                OrderItem.quantity
            ).label("total_quantity")
        )
        .join(
            OrderItem,
            OrderItem.food_id == Food.id
        )
        .group_by(
            Food.id,
            Food.name
        )
        .order_by(
            func.sum(
                OrderItem.quantity
            ).desc()
        )
        .limit(5)
    ).all()

    return [
        {
            "food_id": row.id,
            "food_name": row.name,
            "total_quantity": row.total_quantity
        }
        for row in results
    ]