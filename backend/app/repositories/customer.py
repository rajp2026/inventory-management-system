from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.customer import Customer


class CustomerRepository:

    @staticmethod
    async def create(
        db: AsyncSession,
        customer: Customer
    ):
        db.add(customer)
        await db.commit()
        await db.refresh(customer)

        return customer

    @staticmethod
    async def get_all(
        db: AsyncSession,
        page: int = 1,
        limit: int = 10
    ):
        offset = (page - 1) * limit
        
        # Get total count
        count_result = await db.execute(select(func.count()).select_from(Customer))
        total = count_result.scalar() or 0
        
        # Get paginated items
        result = await db.execute(
            select(Customer).offset(offset).limit(limit)
        )
        items = result.scalars().all()
        
        return items, total

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        customer_id: UUID
    ):
        result = await db.execute(
            select(Customer)
            .where(Customer.id == customer_id)
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_email(
        db: AsyncSession,
        email: str
    ):
        result = await db.execute(
            select(Customer)
            .where(Customer.email == email)
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def delete(
        db: AsyncSession,
        customer: Customer
    ):
        await db.delete(customer)
        await db.commit()

    @staticmethod
    async def update(
        db: AsyncSession,
        customer: Customer
    ):
        await db.commit()
        await db.refresh(customer)

        return customer