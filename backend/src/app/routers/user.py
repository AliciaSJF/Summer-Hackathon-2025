from fastapi import APIRouter, Depends, status, HTTPException
from pymongo.database import Database
from src.app.database.mongodb import get_database, get_mongo_client
from dotenv import load_dotenv
from src.app.models.UserModel import UserCreateModel, UserModel
import os
from datetime import datetime

load_dotenv()

router = APIRouter(prefix="/reputation/users", tags=["users"])

def get_db() -> Database:
    uri = os.getenv("MONGODB_URI")
    client = get_mongo_client(uri)
    return get_database(client)

def convert_mongo_doc(doc):
    """Convert MongoDB document to format expected by Pydantic models"""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# Create user
@router.post("/", response_model=UserModel, status_code=status.HTTP_201_CREATED, summary="6. Crear usuario")
async def create_user(
    payload: UserCreateModel,
    db: Database = Depends(get_db),
):
    col = db["users"]
    mobile = payload.mobile
    
    # Check if user already exists
    existing_user = col.find_one({"mobile": mobile})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this mobile number already exists"
        )
    
    # Create user document with all required fields
    user_data = {
        "mobile": mobile,
        "verified": False,
        "kyc": None,
        "roles": [],
        "metadata": None,
        "createdAt": datetime.utcnow(),
        "lastActiveAt": None,
        "noShowCount": 0,
        "successfulCheckins": 0,
        "anomalyCheckins": 0,
        "reviewCount": 0,
        "averageUserRating": 0.0,
    }
    
    # Validate Open Gateway
    #TODO: Implement Open Gateway
    
    result = col.insert_one(user_data)
    user_data["_id"] = str(result.inserted_id)
    
    return user_data


@router.get("/{user_id}", summary="6. Obtener reputación de usuario")
async def get_user_reputation(
    user_id: str,
    db: Database = Depends(get_db),
):
    return {"user_id": user_id, "score": 0.0, "breakdown": {}} 

