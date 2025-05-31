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
    status: str  # "pending" | "completed" | "anomaly"
    requestedAt: datetime = Field(default_factory=datetime.utcnow)
    otpVerified: Optional[bool] = None
    locationVerified: Optional[bool] = None
    kycVerified: Optional[bool] = None
    completedAt: Optional[datetime] = None
    review: Optional[ReviewSubdoc] = None

class AnomalySubdocModelDTO(BaseModel):
    status: str  # "pending" | "completed" | "anomaly"
    requestedAt: datetime = Field(default_factory=datetime.utcnow)
    completedAt: Optional[datetime] = None
    

class KYCModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str
    email: str
    phone: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {ObjectId: str}
        validate_by_name = True

class ReservationModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    eventId: str
    userId: str
    status: str  # "pending" | "completed" | "anomaly"
    code: str
    hashes: Optional[List[str]] = None
    preverifiedAt: datetime = Field(default_factory=datetime.utcnow)
    otpVerified: bool
    locationVerified: Optional[bool] = None
    kycVerified: bool
    kycInfo: Optional[KYCModel] = None
    checkin: Optional[CheckinSubdoc] = None
    completedAt: Optional[datetime] = None
    cancelledAt: Optional[datetime] = None
    canceledReason: Optional[str] = None
    metadata: Optional[dict] = None  # pricePaid, extras, etc.

    class Config:
        json_encoders = {ObjectId: str}
        validate_by_name = True


    