from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId
from pymongo.database import Database
import uuid

class ReviewEmbeddingModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    reservationId: str
    userId: str
    eventId: str
    businessId: str
    rating: Optional[float] = None
    text: str
    embedding: List[float]
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}
        validate_by_name = True
