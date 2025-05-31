from fastapi import APIRouter, Depends
from pymongo.database import Database
from src.app.database.mongodb import get_database, get_mongo_client
from dotenv import load_dotenv
from src.app.models.UserModel import UserCreateModel
import os

load_dotenv()

router = APIRouter(prefix="/reputation/users", tags=["users"])

def get_db() -> Database:
    uri = os.getenv("MONGODB_URI")
    client = get_mongo_client(uri)
    return get_database(client)

# Create user
@router.post("/", summary="6. Crear usuario")
async def create_user(
    payload: UserCreateModel,
    db: Database = Depends(get_db),
):
    col = db["users"]
    new = payload.dict(by_alias=True)
    mobile = new.get("mobile")
    # Check if user already exists
    user = col.find_one({"mobile": mobile})
    if user:
        return {"user_id": user["_id"], "score": user["score"], "breakdown": user["breakdown"]}
    
    # Validate Open Gateway
    #TODO: Implement Open Gateway
    result = col.insert_one(new)
    new["_id"] = result.inserted_id
    return {"user_id": user_id, "score": 0.0, "breakdown": {}} 


@router.get("/{user_id}", summary="6. Obtener reputación de usuario")
async def get_user_reputation(
    user_id: str,
    db: Database = Depends(get_db),
):
    return {"user_id": user_id, "score": 0.0, "breakdown": {}} 