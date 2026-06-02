from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order import Order


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
                selectinload(Order.order_items)
            )
            .where(Order.id == order_id)
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def get_all(
        db: AsyncSession,
        offset: int = 0,
        limit: int = 10
    ):
        result = await db.execute(
            select(Order)
            .offset(offset)
            .limit(limit)
        )

        return result.scalars().all()

    @staticmethod
    async def delete(
        db: AsyncSession,
        order: Order
    ):
        await db.delete(order)