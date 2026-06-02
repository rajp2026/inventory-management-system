from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db
from app.schemas.product import (
    ProductCreate,
    ProductResponse,
    ProductUpdate
)
from app.schemas.common import GenericResponse, PaginationMeta
import math

from app.services.product import ProductService
from app.repositories.product import ProductRepository


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.post(
    "/create",
    response_model=GenericResponse[ProductResponse],
    status_code=201
)
async def create_product(
    payload: ProductCreate,
    db: AsyncSession = Depends(get_db)
):
    product = await ProductService.create_product(
        db,
        payload
    )
    return GenericResponse(
        status="success",
        message="Product created successfully",
        data=product
    )

@router.get(
    "",
    response_model=GenericResponse[list[ProductResponse]]
)
async def get_products(
    page: int = 1,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    items, total = await ProductRepository.get_all(db, page, limit)
    total_pages = math.ceil(total / limit) if limit > 0 else 1
    
    meta = PaginationMeta(
        page=page,
        limit=limit,
        total_items=total,
        total_pages=total_pages
    )
    
    return GenericResponse(
        status="success",
        message="Products retrieved successfully",
        data=items,
        meta=meta
    )

@router.get(
    "/{product_id}",
    response_model=GenericResponse[ProductResponse]
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

    return GenericResponse(
        status="success",
        message="Product retrieved successfully",
        data=product
    )

@router.put(
    "/{product_id}",
    response_model=GenericResponse[ProductResponse]
)
async def update_product(
    product_id: UUID,
    payload: ProductUpdate,
    db: AsyncSession = Depends(get_db)
):
    product = await ProductService.update_product(
        db,
        product_id,
        payload
    )
    return GenericResponse(
        status="success",
        message="Product updated successfully",
        data=product
    )

@router.delete(
    "/{product_id}",
    status_code=200
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
    return GenericResponse(
        status="success",
        message="Product deleted successfully"
    )