from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId
from pymongo.database import Database
import uuid

# ——— 2. Modelo para la colección `businesses` ———
class BusinessModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str
    vertical: str
    plan: str
    apiKey: str
    config: dict
    taxonomyWeights: dict
    totalReservations: int = 0
    totalNoShows: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}
        validate_by_name = True
        
class CreateBusinessModel(BaseModel):
    name: str
    vertical: str
    plan: str
    apiKey: str
    config: dict
    taxonomyWeights: dict
    
