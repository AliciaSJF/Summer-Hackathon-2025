from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId
from pymongo.database import Database
import uuid

class EventModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    businessId: str
    name: str
    type: str  # "fixed" o "temporal"
    start: datetime
    end: Optional[datetime] = None
    capacity: int
    rules: dict
    metadata: Optional[dict] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True