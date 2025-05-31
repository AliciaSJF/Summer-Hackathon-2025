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
    status: str  # "pending" | "completed" | "anomaly" | "trouble" ESTE HACE REFERENCIA AL STATUS DEL CHECKIN, NO AL RESERVA
    requestedAt: datetime = Field(default_factory=datetime.utcnow)
    otpVerified: Optional[bool] = None
    locationVerified: Optional[bool] = None
    kycVerified: Optional[bool] = None
    completedAt: Optional[datetime] = None
    review: Optional[ReviewSubdoc] = None
    previous_anomaly_checkins: Optional[bool] = None

class AnomalySubdocModelDTO(BaseModel):
    status: str  # "pending" | "completed" | "anomaly" | "trouble"
    

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
    status: str  # "pending" | "completed" | "anomaly" ESTE HACE REFERENCIA AL STATUS DE LA RESERVA, NO AL CHECKIN
    code: Optional[str] = None
    hashes: Optional[List[str]] = None
    preverifiedAt: datetime = Field(default_factory=datetime.utcnow)
    otpVerified: bool = False  # Default value for new reservations
    locationVerified: Optional[bool] = None
    kycVerified: bool = False  # Default value for new reservations
    kycInfo: Optional[KYCModel] = None
    checkin: Optional[CheckinSubdoc] = None
    completedAt: Optional[datetime] = None
    cancelledAt: Optional[datetime] = None
    canceledReason: Optional[str] = None
    metadata: Optional[dict] = None  # pricePaid, extras, etc.

    class Config:
        json_encoders = {ObjectId: str}
        validate_by_name = True
        
class ReservationCreateModel(BaseModel):
    eventId: str
    userId: str
    


    