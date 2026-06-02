from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order import Order
from app.models.order_item import OrderItem

from app.repositories.order import (
    OrderRepository
)

from app.repositories.order_item import (
    OrderItemRepository
)

from app.repositories.customer import (
    CustomerRepository
)

from app.repositories.product import (
    ProductRepository
)

from app.schemas.order import (
    OrderCreate
)

class OrderService:

    @staticmethod
    async def create_order(
        db: AsyncSession,
        payload: OrderCreate
    ):
        try:
            customer = await CustomerRepository.get_by_id(
                db,
                payload.customer_id
            )

            if not customer:
                raise HTTPException(
                    status_code=404,
                    detail="Customer not found"
                )

            order = Order(
                customer_id=payload.customer_id,
                total_amount=0
            )

            await OrderRepository.create(
                db,
                order
            )

            total_amount = Decimal("0")

            for item in payload.items:
                product = await ProductRepository.get_by_id(
                    db,
                    item.product_id
                )

                if not product:
                    raise HTTPException(
                        status_code=404,
                        detail=f"Product {item.product_id} not found"
                    )

                if product.stock_quantity < item.quantity:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Insufficient stock for {product.name}"
                    )

                line_total = product.price * item.quantity
                total_amount += line_total

                order_item = OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=item.quantity,
                    unit_price=product.price
                )

                await OrderItemRepository.create(
                    db,
                    order_item
                )

                product.stock_quantity -= item.quantity

            order.total_amount = total_amount

            await db.commit()
            await db.refresh(order)

            return order

        except Exception:
            await db.rollback()
            raise