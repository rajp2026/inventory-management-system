from sqlalchemy import (
    String,
    Numeric,
    Integer,
    CheckConstraint
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.db.base import Base
from app.models.base_model import BaseModelMixin


class Product(BaseModelMixin, Base):
    __tablename__ = "products"

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    sku: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )

    stock_quantity: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    order_items = relationship(
        "OrderItem",
        back_populates="product"
    )

    __table_args__ = (
        CheckConstraint(
            "stock_quantity >= 0",
            name="check_stock_positive"
        ),
    )