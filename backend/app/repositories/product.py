from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product


class ProductRepository:

    @staticmethod
    async def get_all(db: AsyncSession):
        result = await db.execute(
            select(Product)
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