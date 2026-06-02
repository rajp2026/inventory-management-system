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
    response_model=CustomerResponse,
    status_code=201
)
async def create_customer(
    payload: CustomerCreate,
    db: AsyncSession = Depends(get_db)
):
    return await CustomerService.create_customer(
        db,
        payload
    )

@router.get(
    "",
    response_model=list[CustomerResponse]
)
async def get_customers(
    db: AsyncSession = Depends(get_db)
):
    return await CustomerRepository.get_all(
        db
    )

@router.get(
    "/{customer_id}",
    response_model=CustomerResponse
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

    return customer

@router.delete(
    "/{customer_id}",
    status_code=204
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


@router.put(
    "/{customer_id}",
    response_model=CustomerResponse
)
async def update_customer(
    customer_id: UUID,
    payload: CustomerUpdate,
    db: AsyncSession = Depends(get_db)
):
    return await CustomerService.update_customer(
        db,
        customer_id,
        payload
    )