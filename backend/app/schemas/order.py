from uuid import UUID
from pydantic import BaseModel, Field
from decimal import Decimal


class OrderItemCreate(BaseModel):
    product_id: UUID
    quantity: int = Field(gt=0, description="Quantity must be at least 1")


class OrderCreate(BaseModel):
    customer_id: UUID
    items: list[OrderItemCreate]


class OrderItemResponse(BaseModel):
    product_id: UUID
    quantity: int
    unit_price: Decimal


class OrderResponse(BaseModel):
    id: UUID
    customer_id: UUID
    total_amount: Decimal
    items: list[OrderItemResponse]

    model_config = {
        "from_attributes": True
    }