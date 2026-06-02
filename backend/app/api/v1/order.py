from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db
from app.schemas.order import OrderCreate
from app.services.order import OrderService

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

@router.post(
    "",
    status_code=201
)
async def create_order(
    payload: OrderCreate,
    db: AsyncSession = Depends(get_db)
):
    # As requested, not using the GenericResponse yet, just testing the raw flow!
    order = await OrderService.create_order(
        db,
        payload
    )
    return order
