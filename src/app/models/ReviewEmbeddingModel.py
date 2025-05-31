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
    businessId: str
    text: str
    embedding: List[float]
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True
