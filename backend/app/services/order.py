from decimal import Decimal

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import (
    CustomerNotFoundException,
    ProductNotFoundException,
    InventoryNotAvailableException
)

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product

from app.repositories.customer import (
    CustomerRepository
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
            # 1. Validate customer ──────────────── 1 query
            customer = await CustomerRepository.get_by_id(
                db,
                payload.customer_id
            )

            if not customer:
                raise CustomerNotFoundException()

            # 2. Batch-fetch ALL products with row lock ── 1 query
            product_ids = [
                item.product_id for item in payload.items
            ]

            result = await db.execute(
                select(Product)
                .where(Product.id.in_(product_ids))
                .with_for_update()
            )

            products = {
                p.id: p for p in result.scalars().all()
            }

            # 3. Validate ALL items before any writes
            order_items = []
            total_amount = Decimal("0")

            for item in payload.items:
                product = products.get(item.product_id)

                if not product:
                    raise ProductNotFoundException(
                        f"Product {item.product_id} not found"
                    )

                if product.stock_quantity < item.quantity:
                    raise InventoryNotAvailableException(
                        f"Insufficient stock for {product.name}"
                    )

                line_total = product.price * item.quantity
                total_amount += line_total

                order_items.append(
                    OrderItem(
                        product_id=product.id,
                        quantity=item.quantity,
                        unit_price=product.price
                    )
                )

            # 4. All validations passed — create order with items
            order = Order(
                customer_id=payload.customer_id,
                total_amount=total_amount,
                order_items=order_items
            )

            db.add(order)

            # 5. Atomic stock decrement ──────────── N UPDATE queries
            for item in payload.items:
                await db.execute(
                    update(Product)
                    .where(Product.id == item.product_id)
                    .values(
                        stock_quantity=Product.stock_quantity - item.quantity
                    )
                )

            # 6. Commit + reload with items ──────── 1 commit + 1 query
            await db.commit()

            result = await db.execute(
                select(Order)
                .options(selectinload(Order.order_items))
                .where(Order.id == order.id)
            )

            return result.scalar_one()

        except Exception:
            await db.rollback()
            raise