from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order import Order
from app.models.order_item import OrderItem


class OrderRepository:

    @staticmethod
    async def create(
        db: AsyncSession,
        order: Order
    ):
        db.add(order)
        await db.flush()

        return order

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        order_id: UUID
    ):
        result = await db.execute(
            select(Order)
            .options(
                selectinload(Order.customer),
                selectinload(Order.order_items).selectinload(OrderItem.product)
            )
            .where(Order.id == order_id)
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def count(db: AsyncSession):
        from sqlalchemy import func
        result = await db.execute(select(func.count()).select_from(Order))
        return result.scalar() or 0

    @staticmethod
    async def get_all(
        db: AsyncSession,
        page: int = 1,
        limit: int = 10
    ):
        from sqlalchemy import func
        offset = (page - 1) * limit
        
        count_result = await db.execute(select(func.count()).select_from(Order))
        total = count_result.scalar() or 0

        result = await db.execute(
            select(Order)
            .options(
                selectinload(Order.customer),
                selectinload(Order.order_items)
                .selectinload(OrderItem.product)
            )
            .offset(offset)
            .limit(limit)
        )

        return result.scalars().all(), total

    @staticmethod
    async def delete(
        db: AsyncSession,
        order: Order
    ):
        await db.delete(order)