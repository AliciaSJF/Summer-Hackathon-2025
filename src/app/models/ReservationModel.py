from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId
from pymongo.database import Database
import uuid

# ——— 4. Modelo para la colección `reservations` (anida checkin + review) ———
class ReviewSubdoc(BaseModel):
    rating: int
    comment: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[dict] = None

class CheckinSubdoc(BaseModel):
    status: str  # "pending" | "completed" | "failed"
    requestedAt: datetime = Field(default_factory=datetime.utcnow)
    otpVerified: Optional[bool] = None
    locationVerified: Optional[bool] = None
    completedAt: Optional[datetime] = None
    anomalies: List[dict] = []
    review: Optional[ReviewSubdoc] = None

class ReservationModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    eventId: str
    userId: str
    status: str  # "preverified" | "completed" | "cancelled"
    code: str
    hashes: List[str]
    preverifiedAt: datetime = Field(default_factory=datetime.utcnow)
    otpVerified: bool
    locationVerified: bool
    kycVerified: bool
    checkin: Optional[CheckinSubdoc] = None
    completedAt: Optional[datetime] = None
    cancelledAt: Optional[datetime] = None
    canceledReason: Optional[str] = None
    metadata: Optional[dict] = None  # pricePaid, extras, etc.

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True