from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId
from pymongo.database import Database
import uuid

class KYCModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str
    email: str
    phone: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    birth_date: datetime 
    address: Optional[str] = None
    gender : Optional[str] = None
    
    class Config:
        json_encoders = {ObjectId: str}
        validate_by_name = True

class UserModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    mobile: str
    verified: bool = False
    kyc: Optional[KYCModel] = None
    roles: List[str] = []
    metadata: Optional[dict] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    lastActiveAt: Optional[datetime] = None
    noShowCount: int = 0
    successfulCheckins: int = 0
    anomalyCheckins: int = 0
    reviewCount: int = 0
    averageUserRating: float = 0.0

    class Config:
        json_encoders = {ObjectId: str}
        validate_by_name = True
        
    
class UserCreateModel(BaseModel):
    mobile: str
    name: str
    email: str
    phone: str
    birth_date: datetime 
    address: Optional[str] = None
    gender : Optional[str] = None