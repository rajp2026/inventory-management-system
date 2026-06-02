from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db
from app.schemas.order import OrderCreate, OrderResponse
from app.schemas.common import GenericResponse
from app.services.order import OrderService

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
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
