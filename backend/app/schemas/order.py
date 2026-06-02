from uuid import UUID
from pydantic import BaseModel, Field, model_validator
from decimal import Decimal


class OrderItemCreate(BaseModel):
    product_id: UUID
    quantity: int = Field(
        gt=0,
        description="Quantity must be at least 1"
    )


class OrderCreate(BaseModel):
    customer_id: UUID
    items: list[OrderItemCreate] = Field(min_length=1)

    @model_validator(mode="after")
    def check_unique_products(self):
        product_ids = [
            item.product_id for item in self.items
        ]

        if len(product_ids) != len(set(product_ids)):
            raise ValueError(
                "Duplicate product IDs are not allowed "
                "in the same order"
            )

        return self


class OrderItemResponse(BaseModel):
    product_id: UUID
    quantity: int
    unit_price: Decimal


class OrderResponse(BaseModel):
    id: UUID
    customer_id: UUID
    total_amount: Decimal
    order_items: list[OrderItemResponse]

    model_config = {
        "from_attributes": True
    }