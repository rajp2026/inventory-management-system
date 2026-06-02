from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.ext.asyncio import (
    AsyncSession
)

from app.db.dependencies import get_db

from app.schemas.customer import (
    CustomerCreate,
    CustomerUpdate,
    CustomerResponse
)
from app.schemas.common import GenericResponse, PaginationMeta
import math

from app.services.customer import (
    CustomerService
)

from app.repositories.customer import (
    CustomerRepository
)


router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)

@router.post(
    "",
    response_model=GenericResponse[CustomerResponse],
    status_code=201
)
async def create_customer(
    payload: CustomerCreate,
    db: AsyncSession = Depends(get_db)
):
    customer = await CustomerService.create_customer(
        db,
        payload
    )
    return GenericResponse(
        status="success",
        message="Customer created successfully",
        data=customer
    )

@router.get(
    "",
    response_model=GenericResponse[list[CustomerResponse]]
)
async def get_customers(
    page: int = 1,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    items, total = await CustomerRepository.get_all(db, page, limit)
    total_pages = math.ceil(total / limit) if limit > 0 else 1
    
    meta = PaginationMeta(
        page=page,
        limit=limit,
        total_items=total,
        total_pages=total_pages
    )
    
    return GenericResponse(
        status="success",
        message="Customers retrieved successfully",
        data=items,
        meta=meta
    )

@router.get(
    "/{customer_id}",
    response_model=GenericResponse[CustomerResponse]
)
async def get_customer(
    customer_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    customer = (
        await CustomerRepository.get_by_id(
            db,
            customer_id
        )
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return GenericResponse(
        status="success",
        message="Customer retrieved successfully",
        data=customer
    )

@router.put(
    "/{customer_id}",
    response_model=GenericResponse[CustomerResponse]
)
async def update_customer(
    customer_id: UUID,
    payload: CustomerUpdate,
    db: AsyncSession = Depends(get_db)
):
    customer = await CustomerService.update_customer(
        db,
        customer_id,
        payload
    )
    return GenericResponse(
        status="success",
        message="Customer updated successfully",
        data=customer
    )

@router.delete(
    "/{customer_id}",
    status_code=200
)
async def delete_customer(
    customer_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    customer = (
        await CustomerRepository.get_by_id(
            db,
            customer_id
        )
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    await CustomerRepository.delete(
        db,
        customer
    )
    return GenericResponse(
        status="success",
        message="Customer deleted successfully"
    )