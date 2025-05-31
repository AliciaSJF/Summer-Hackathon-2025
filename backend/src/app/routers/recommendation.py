from fastapi import APIRouter, Depends
from pymongo.database import Database
from src.app.database.mongodb import get_database, get_mongo_client
from dotenv import load_dotenv
import os

router = APIRouter(prefix="/recommendations/users", tags=["recommendations"])

load_dotenv()

def get_db() -> Database:
    uri = os.getenv("MONGODB_URI")
    return get_database(client)

@router.get("/{user_id}", summary="7. Agente IA: recomendaciones personalizadas")
async def get_recommendations(
    user_id: str,
    db: Database = Depends(get_db),
):
    return {"user_id": user_id, "recommendations": []} 

