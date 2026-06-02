from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db

from app.schemas.product import (
    ProductCreate,
    ProductResponse,
    ProductUpdate
)

from app.services.product import ProductService
from app.repositories.product import ProductRepository


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.post(
    "/create",
    response_model=ProductResponse,
    status_code=201
)
async def create_product(
    payload: ProductCreate,
    db: AsyncSession = Depends(get_db)
):
    return await ProductService.create_product(
        db,
        payload
    )
@router.get(
    "",
    response_model=list[ProductResponse]
)
async def get_products(
    db: AsyncSession = Depends(get_db)
):
    return await ProductRepository.get_all(db)

@router.get(
    "/{product_id}",
    response_model=ProductResponse
)
async def get_product(
    product_id: UUID,
    db: AsyncSession = Depends(get_db)
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

    return product

@router.put(
    "/{product_id}",
    response_model=ProductResponse
)
async def update_product(
    product_id: UUID,
    payload: ProductUpdate,
    db: AsyncSession = Depends(get_db)
):
    return await ProductService.update_product(
        db,
        product_id,
        payload
    )

@router.delete(
    "/{product_id}",
    status_code=204
)
async def delete_product(
    product_id: UUID,
    db: AsyncSession = Depends(get_db)
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

    await ProductRepository.delete(
        db,
        product
    )