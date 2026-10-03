from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine


# REGISTER SQLALCHEMY MODELS

from app.models.user import User
from app.models.category import Category
from app.models.food import Food
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem


# IMPORT ROUTERS

from app.routers import (
    auth,
    categories,
    foods,
    customers,
    orders,
    dashboard,
    users,
)


# CREATE DATABASE TABLES

Base.metadata.create_all(bind=engine)


# CREATE FASTAPI APP

app = FastAPI(
    title="CraveCart API",
    description="Food Ordering System REST API",
    version="1.0.0"
)


# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://crave-cart-alpha.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# STATIC IMAGE FILES

UPLOAD_DIR = Path("uploads")

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)

app.mount(
    "/uploads",
    StaticFiles(directory=UPLOAD_DIR),
    name="uploads"
)


# ROUTERS

app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(foods.router)
app.include_router(customers.router)
app.include_router(orders.router)
app.include_router(dashboard.router)
app.include_router(users.router)


# HOME

@app.get("/")
def home():
    return {
        "message": "Welcome to CraveCart API"
    }