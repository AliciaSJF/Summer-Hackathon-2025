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
    description: str
    type: str  # "fixed" o "temporal"
    start: datetime
    end: Optional[datetime] = None
    capacity: int
    location: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    price: Optional[float] = 0.0  # Default value for existing events
    latitude: Optional[float] = None
    longitude: Optional[float] = None
   
    class Config:
        json_encoders = {ObjectId: str}
        validate_by_name = True
       
class CreateEventModel(BaseModel):
    businessId: str
    name: str
    description: str
    type: str  # "fixed" o "temporal"
    start: datetime
    end: Optional[datetime] = None
    capacity: int
    location: str
    price: Optional[float] = 0.0  # Default value for existing events
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
class EventWithReservationModel(EventModel):
    event: EventModel
    reservation_id: str