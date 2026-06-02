from decimal import Decimal

from sqlalchemy import (
    ForeignKey,
    Numeric
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.db.base import Base
from app.models.base_model import BaseModelMixin


class Order(BaseModelMixin, Base):
    __tablename__ = "orders"

    customer_id: Mapped[str] = mapped_column(
        ForeignKey("customers.id"),
        nullable=False
    )

    total_amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        default=0
    )

    customer = relationship(
        "Customer",
        back_populates="orders"
    )

    order_items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan"
    )