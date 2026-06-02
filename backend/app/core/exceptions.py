from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.schemas.common import GenericResponse
import traceback
import logging

logger = logging.getLogger(__name__)

class AppException(Exception):
    def __init__(self, status_code: int, message: str, data: dict = None):
        self.status_code = status_code
        self.message = message
        self.data = data

async def app_exception_handler(request: Request, exc: AppException):
    logger.error(f"AppException: {exc.message}")
    response = GenericResponse(
        status="error",
        message=exc.message,
        data=exc.data
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=response.model_dump()
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.error(f"HTTPException: {exc.detail}")
    response = GenericResponse(
        status="error",
        message=str(exc.detail)
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=response.model_dump()
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"ValidationError: {exc.errors()}")
    response = GenericResponse(
        status="error",
        message="Validation Error",
        data={"errors": exc.errors()}
    )
    return JSONResponse(
        status_code=422,
        content=response.model_dump()
    )

async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {str(exc)}\n{traceback.format_exc()}")
    response = GenericResponse(
        status="error",
        message="Internal Server Error"
    )
    return JSONResponse(
        status_code=500,
        content=response.model_dump()
    )
