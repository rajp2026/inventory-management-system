from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product


class ProductRepository:

    @staticmethod
    async def count(db: AsyncSession):
        result = await db.execute(select(func.count()).select_from(Product))
        return result.scalar() or 0

    @staticmethod
    async def get_all(db: AsyncSession, page: int = 1, limit: int = 10):
        offset = (page - 1) * limit
        
        # Get total count
        count_result = await db.execute(select(func.count()).select_from(Product))
        total = count_result.scalar() or 0
        
        # Get paginated items
        result = await db.execute(
            select(Product).offset(offset).limit(limit)
        )
        items = result.scalars().all()
        
        return items, total

    @staticmethod
    async def get_low_stock(db: AsyncSession, threshold: int = 10, limit: int = 10):
        result = await db.execute(
            select(Product)
            .where(Product.stock_quantity <= threshold)
            .order_by(Product.stock_quantity.asc())
            .limit(limit)
        )
        return result.scalars().all()

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        product_id: UUID
    ):
        result = await db.execute(
            select(Product)
            .where(Product.id == product_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_sku(
        db: AsyncSession,
        sku: str
    ):
        result = await db.execute(
            select(Product)
            .where(Product.sku == sku)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def create(
        db: AsyncSession,
        product: Product
    ):
        db.add(product)
        await db.commit()
        await db.refresh(product)
        return product

    @staticmethod
    async def delete(
        db: AsyncSession,
        product: Product
    ):
        from app.models.order_item import OrderItem
        from app.core.exceptions import DependentRecordException
        from sqlalchemy import select
        
        # Check if product is in any orders
        order_item_result = await db.execute(select(OrderItem.id).where(OrderItem.product_id == product.id).limit(1))
        has_orders = order_item_result.scalar_one_or_none()
        
        if has_orders:
            raise DependentRecordException("Cannot delete product because it is part of existing orders. Please delete the related orders first.")
        
        await db.delete(product)
        await db.commit()
    
    @staticmethod
    async def update(
        db: AsyncSession,
        product: Product
    ):
        await db.commit()
        await db.refresh(product)
        return product