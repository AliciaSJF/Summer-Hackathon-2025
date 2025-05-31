from fastapi import APIRouter, Depends, status, HTTPException
from pymongo.database import Database
from src.app.database.mongodb import get_database, get_mongo_client
from dotenv import load_dotenv
from src.app.models.UserModel import UserCreateModel, UserModel, KYCModel
import os
from datetime import datetime
import uuid

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
@router.post("/", response_model=bool | dict, status_code=status.HTTP_201_CREATED, summary="6. Crear usuario")
async def create_user(
    payload: UserCreateModel,
    db: Database = Depends(get_db),
):
    col = db["users"]
    phone = payload.phone
    
    # Check if user already exists
    existing_user = col.find_one({"kyc.phone": phone})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this mobile number already exists"
        )
    
    # Validate Open Gateway and create KYC
    # TODO: Implement Open Gateway validation
    
    try:
        # Extract KYC data from payload and create KYCModel
        kyc_data = {
            "name": payload.name,
            "email": payload.email,
            "phone": payload.phone,
            "birth_date": payload.birth_date,
            "address": payload.address,
            "gender": payload.gender,
            "createdAt": datetime.utcnow(),
        }
        
        # TODO: Validate KYC data 
        # Create KYC model instance for validation
        kyc_model = KYCModel(**kyc_data)
        
        # TODO: Add actual KYC validation logic here
        # if kyc_validation_fails:
        #     return False
        
        # Create user document with all required fields including KYC
        user_data = {
            "verified": True,  # Set to True since we have KYC data
            "kyc": kyc_model.dict(by_alias=True),  # Include the KYC data
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
        
        result = col.insert_one(user_data)
        
        # Return True if user was created successfully
        return True
        
    except Exception as e:
        # If KYC validation or user creation fails, return False
        print(f"Error creating user: {e}")
        return {"name": False}


@router.get("/{user_id}", summary="6. Obtener reputación de usuario")
async def get_user_reputation(
    user_id: str,
    db: Database = Depends(get_db),
):
    return {"user_id": user_id, "score": 0.0, "breakdown": {}} 

