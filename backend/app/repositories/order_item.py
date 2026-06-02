from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order_item import OrderItem


class OrderItemRepository:

    @staticmethod
    async def create(
        db: AsyncSession,
        order_item: OrderItem
    ):
        db.add(order_item)

        return order_item