from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db
from app.schemas.order import OrderCreate, OrderResponse
from app.schemas.common import GenericResponse, PaginationMeta
from app.services.order import OrderService
from app.repositories.order import OrderRepository
import math

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

@router.get(
    "/count",
    response_model=GenericResponse[int]
)
async def get_order_count(
    db: AsyncSession = Depends(get_db)
):
    count = await OrderRepository.count(db)
    return GenericResponse(
        status="success",
        message="Count retrieved successfully",
        data=count
    )

@router.get(
    "",
    response_model=GenericResponse[list[OrderResponse]]
)
async def get_orders(
    page: int = 1,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    items, total = await OrderRepository.get_all(db, page, limit)
    total_pages = math.ceil(total / limit) if limit > 0 else 1
    
    meta = PaginationMeta(
        page=page,
        limit=limit,
        total_items=total,
        total_pages=total_pages
    )
    
    return GenericResponse(
        status="success",
        message="Orders retrieved successfully",
        data=items,
        meta=meta
    )

@router.post(
    "",
    response_model=GenericResponse[OrderResponse],
    status_code=201
)
async def create_order(
    payload: OrderCreate,
    db: AsyncSession = Depends(get_db)
):
    order = await OrderService.create_order(
        db,
        payload
    )
    return GenericResponse(
        status="success",
        message="Order created successfully",
        data=order
    )
