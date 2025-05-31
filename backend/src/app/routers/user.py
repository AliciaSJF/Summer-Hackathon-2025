from fastapi import APIRouter, Depends
from pymongo.database import Database
from src.app.database.mongodb import get_database, get_mongo_client
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter(prefix="/reputation/users", tags=["users"])

def get_db() -> Database:
    uri = os.getenv("MONGODB_URI")
    client = get_mongo_client(uri)
    return get_database(client)

@router.get("/{user_id}", summary="6. Obtener reputación de usuario")
async def get_user_reputation(
    user_id: str,
    db: Database = Depends(get_db),
):
    return {"user_id": user_id, "score": 0.0, "breakdown": {}} 