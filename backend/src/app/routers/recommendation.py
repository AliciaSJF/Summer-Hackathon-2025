from fastapi import APIRouter, Depends
from pymongo.database import Database
from src.app.database.mongodb import get_database, get_mongo_client

router = APIRouter(prefix="/recommendations/users", tags=["recommendations"])

def get_db() -> Database:
    client = get_mongo_client()
    return get_database(client)

@router.get("/{user_id}", summary="7. Agente IA: recomendaciones personalizadas")
async def get_recommendations(
    user_id: str,
    db: Database = Depends(get_db),
):
    return {"user_id": user_id, "recommendations": []} 

