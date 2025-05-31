from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId
from pymongo.database import Database
import uuid

class UserModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    mobile: str
    verified: bool = False
    kyc: Optional[dict] = None
    roles: List[str] = []
    metadata: Optional[dict] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    lastActiveAt: Optional[datetime] = None
    noShowCount: int = 0
    successfulCheckins: int = 0
    failedCheckins: int = 0
    reviewCount: int = 0
    averageUserRating: float = 0.0

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True