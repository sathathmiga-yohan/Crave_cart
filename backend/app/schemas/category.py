from pydantic import BaseModel, Field


# CATEGORY CREATE SCHEMA

class CategoryCreate(BaseModel):

    name: str = Field(
        min_length=2,
        max_length=100
    )

    description: str | None = Field(
        default=None,
        max_length=255
    )


# CATEGORY UPDATE SCHEMA

class CategoryUpdate(BaseModel):

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    description: str | None = Field(
        default=None,
        max_length=255
    )


# CATEGORY RESPONSE SCHEMA

class CategoryResponse(BaseModel):

    id: int
    name: str
    description: str | None

    model_config = {
        "from_attributes": True
    }