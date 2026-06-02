from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class PaginationMeta(BaseModel):
    page: int
    limit: int
    total_items: int
    total_pages: int


class GenericResponse(BaseModel, Generic[T]):
    status: str
    message: str
    data: Optional[T] = None
    meta: Optional[PaginationMeta] = None

    model_config = {"from_attributes": True}
