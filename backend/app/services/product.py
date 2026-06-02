from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product
from app.repositories.product import ProductRepository
from app.schemas.product import (
    ProductCreate,
    ProductUpdate
)


class ProductService:

    @staticmethod
    async def create_product(
        db: AsyncSession,
        data: ProductCreate
    ):
        existing = await ProductRepository.get_by_sku(
            db,
            data.sku
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="SKU already exists"
            )

        if data.stock_quantity < 0:
            raise HTTPException(
                status_code=400,
                detail="Stock cannot be negative"
            )

        product = Product(
            name=data.name,
            sku=data.sku,
            price=data.price,
            stock_quantity=data.stock_quantity
        )

        return await ProductRepository.create(
            db,
            product
        )
    
    @staticmethod
    async def update_product(
        db,
        product_id,
        data
    ):
        product = await ProductRepository.get_by_id(
            db,
            product_id
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        update_data = data.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(
                product,
                field,
                value
            )

        return await ProductRepository.update(
            db,
            product
        )