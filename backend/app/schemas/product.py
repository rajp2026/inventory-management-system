from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel
from pydantic import Field
from pydantic import ConfigDict


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    sku: str = Field(min_length=1, max_length=100)
    price: Decimal = Field(gt=0, description="Price must be strictly positive")
    stock_quantity: int = Field(ge=0, description="Stock cannot be negative")


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=255)
    sku: str | None = Field(default=None, min_length=1, max_length=100)
    price: Decimal | None = Field(default=None, gt=0)
    stock_quantity: int | None = Field(default=None, ge=0)


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    sku: str
    price: Decimal
    stock_quantity: int