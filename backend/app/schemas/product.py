from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel
from pydantic import Field
from pydantic import ConfigDict


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    sku: str = Field(min_length=1, max_length=100)
    price: Decimal
    stock_quantity: int


class ProductUpdate(BaseModel):
    name: str | None = None
    sku: str | None = None
    price: Decimal | None = None
    stock_quantity: int | None = None


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    sku: str
    price: Decimal
    stock_quantity: int