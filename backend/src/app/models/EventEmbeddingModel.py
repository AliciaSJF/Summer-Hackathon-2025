from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId
from pymongo.database import Database
import uuid

class EventEmbeddingModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    eventId: str
    businessId: str
    description: str
    embedding: List[float]
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}
        validate_by_name = True
