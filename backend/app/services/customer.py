from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.customer import Customer
from app.schemas.customer import CustomerUpdate

from app.repositories.customer import (
    CustomerRepository
)

from app.schemas.customer import (
    CustomerCreate
)


class CustomerService:

    @staticmethod
    async def create_customer(
        db: AsyncSession,
        payload: CustomerCreate
    ):
        existing_customer = (
            await CustomerRepository.get_by_email(
                db,
                payload.email
            )
        )

        if existing_customer:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        customer = Customer(
            full_name=payload.full_name,
            email=payload.email,
            phone=payload.phone
        )

        return await CustomerRepository.create(
            db,
            customer
        )


    @staticmethod
    async def update_customer(
        db: AsyncSession,
        customer_id: UUID,
        payload: CustomerUpdate
    ):
        customer = await CustomerRepository.get_by_id(
            db,
            customer_id
        )

        if not customer:
            raise HTTPException(
                status_code=404,
                detail="Customer not found"
            )

        update_data = payload.model_dump(
            exclude_unset=True
        )

        # email uniqueness check
        if "email" in update_data:
            existing_customer = (
                await CustomerRepository.get_by_email(
                    db,
                    update_data["email"]
                )
            )

            if (
                existing_customer
                and existing_customer.id != customer.id
            ):
                raise HTTPException(
                    status_code=400,
                    detail="Email already exists"
                )

        for field, value in update_data.items():
            setattr(customer, field, value)

        return await CustomerRepository.update(
            db,
            customer
        )