# src/app/main.py

from fastapi import FastAPI
from src.app.routers.business import router as business_router
from src.app.routers.event import router as event_router
from src.app.routers.reservation import router as reservation_router
from src.app.routers.user import router as user_router
from src.app.routers.recommendation import router as recommendation_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Reputation Platform API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(business_router)
app.include_router(event_router)
app.include_router(reservation_router)
app.include_router(user_router)
app.include_router(recommendation_router)
