from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.product import router as product_router

app = FastAPI(title="Inventory Management System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Inventory Management System API"}


app.include_router(product_router)