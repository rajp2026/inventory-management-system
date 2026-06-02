from uuid import UUID
from typing import Any
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
    product_name: str = ""
    quantity: int
    unit_price: Decimal

    model_config = {"from_attributes": True}

    @model_validator(mode='before')
    @classmethod
    def extract_product_name(cls, data: Any):
        if hasattr(data, 'product') and data.product:
            if isinstance(data, dict):
                data['product_name'] = data.get(
                    'product', {}
                ).get('name', '')
            else:
                return {
                    'product_id': data.product_id,
                    'product_name': (
                        data.product.name
                        if data.product else ''
                    ),
                    'quantity': data.quantity,
                    'unit_price': data.unit_price,
                }
        return data


class OrderResponse(BaseModel):
    id: UUID
    customer_id: UUID
    customer_name: str = ""
    total_amount: Decimal
    order_items: list[OrderItemResponse]

    model_config = {"from_attributes": True}

    @model_validator(mode='before')
    @classmethod
    def extract_customer_name(cls, data: Any):
        if hasattr(data, 'customer') and data.customer:
            if isinstance(data, dict):
                data['customer_name'] = data.get(
                    'customer', {}
                ).get('full_name', '')
            else:
                return {
                    'id': data.id,
                    'customer_id': data.customer_id,
                    'customer_name': (
                        data.customer.full_name
                        if data.customer else ''
                    ),
                    'total_amount': data.total_amount,
                    'order_items': data.order_items,
                }
        return data