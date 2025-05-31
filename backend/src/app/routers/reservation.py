from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from bson import ObjectId
from src.app.database.mongodb import get_database, get_mongo_client
from src.app.models.ReservationModel import ReservationModel, CheckinSubdoc, ReviewSubdoc, AnomalySubdocModelDTO, ReservationCreateModel
from dotenv import load_dotenv
from typing import List
from datetime import datetime
import os
import random
router = APIRouter(prefix="/reservations", tags=["reservations"])

load_dotenv()

def get_db() -> Database:
    uri = os.getenv("MONGODB_URI")
    client = get_mongo_client(uri)
    return get_database(client)

def convert_mongo_doc(doc):
    """Convert MongoDB document to format expected by Pydantic models"""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

def convert_mongo_docs(docs):
    """Convert list of MongoDB documents to format expected by Pydantic models"""
    return [convert_mongo_doc(doc) for doc in docs]

# Obtener reservas por eventoId
@router.get(
    "/event/{event_id}",
    response_model=List[ReservationModel],
    summary="Obtener reservas por eventoId",
)
async def get_reservations_by_event(
    event_id: str,
    db: Database = Depends(get_db),
):
    col = db["reservations"]
    reservations = list(col.find({"eventId": event_id}))
    return convert_mongo_docs(reservations)

# Obtener reservas por userId
@router.get(
    "/user/{user_id}",
    response_model=List[ReservationModel],
    summary="Obtener reservas por userId",
)
async def get_reservations_by_user(
    user_id: str,
    db: Database = Depends(get_db),
):
    col = db["reservations"]
    reservations = list(col.find({"userId": user_id}))
    return convert_mongo_docs(reservations)


@router.post(
    "",
    response_model=ReservationModel,
    status_code=status.HTTP_201_CREATED,
    summary="3. Pre-verificación y reserva",
)
async def create_reservation(
    payload: ReservationCreateModel,
    db: Database = Depends(get_db),
):
    col = db["reservations"]
    
    # Create reservation data with all required fields
    reservation_data = payload.dict(by_alias=True)
    
    # Add fields that are auto-generated or have defaults
    reservation_data.update({
        "preverifiedAt": datetime.utcnow(),
        "otpVerified": False,
        "kycVerified": False,
        "locationVerified": None,
        "kycInfo": None,
        "checkin": None,
        "completedAt": None,
        "cancelledAt": None,
        "canceledReason": None,
    })
    
    result = col.insert_one(reservation_data)
    # Convert ObjectId to string for response
    reservation_data["_id"] = str(result.inserted_id)
    
    return reservation_data

@router.post(
    "/{reservation_id}/checkin",
    response_model=CheckinSubdoc,
    summary="4. Check-in físico del cliente",
)
async def do_checkin(
    reservation_id: str,
    db: Database = Depends(get_db),
):
    col = db["reservations"]
    res = col.find_one({"_id": ObjectId(reservation_id)})
    if not res:
        raise HTTPException(404, "Reserva no encontrada")
    
    # Check if reservation is already completed
    checkin = res.get("checkin")
    if checkin and checkin.get("status") in ["completed", "anomaly"]:
        raise HTTPException(400, "Reserva ya completada")
    
    # Check if user has any anomaly checkins and save in a previous_anomaly_checkins field
    user_id = res.get("userId")
    user_col = db["users"]
    user = user_col.find_one({"_id": ObjectId(user_id)})
    previous_anomaly_checkins = user.get("anomalyCheckins", 0)
    # TODO: IMPLEMENT THIS REAL LOGIC
    #if previous_anomaly_checkins > 0:
    #    previous_anomaly_checkins = True
    #else:
    #    previous_anomaly_checkins = False
    # Random anomaly checkins for testing boolean
    previous_anomaly_checkins = random.random() > 0.5
    
    # If random > 0.5, set status to anomaly, else set to completed
    # TODO: Implement real checkin verifyting KYC, OTP, LOCATION
    # Call to external service to verify location
    # Call to external service to verify OTP
    # Call to external service to verify KYC

    ##telefono del usuario 
    phone = res.get("kycInfo").get("phone")
    event_id= res.get("eventID")
    res = col.find_one({"_id": ObjectId(reservation_id)})
    #TODO: Implementar verificación de ubicación
    event_col = db["events"]
    event = event_col.find_one({"_id": ObjectId(res.get("eventId"))})
    # Get event latitude and longitude
    latitude = event.get("latitude")
    longitude = event.get("longitude")

    
    #

    # TODO: REMOVE THIS NEXT CODE
    random_number = random.random()
    if random_number > 0.5:
        status = "anomaly"
    else:
        status = "completed"
    
    updated_checkin = {
        "status": status,
        "requestedAt": datetime.now(),
        "otpVerified": True,
        "locationVerified": True,
        "kycVerified": True,
        "completedAt": None,
        "anomalies": [],
        "review": None,
        "previous_anomaly_checkins": previous_anomaly_checkins,
    }
    col.update_one(
        {"_id": ObjectId(reservation_id)},
        {"$set": {"checkin": updated_checkin}}
    )
    return updated_checkin

@router.post(
    "/{reservation_id}/checkin/trouble",
    response_model=bool,
    summary="Añadir problema a reserva",
)
async def create_trouble(
    reservation_id: str,
    payload: AnomalySubdocModelDTO,
    db: Database = Depends(get_db),
):
    col = db["reservations"]
    res = col.find_one({"_id": ObjectId(reservation_id)})
    # Update reservation checkin status to trouble
    
    if not res or not res.get("checkin") or res["checkin"].get("status") != "completed":
        raise HTTPException(400, "Check-in no válido para crear anomalía")
    
    user_id = res.get("userId")
    user_col = db["users"]
    user = user_col.find_one({"_id": ObjectId(user_id)})
    # Update user anomalyCheckins +1
    user["anomalyCheckins"] += 1
    user_col.update_one({"_id": ObjectId(user_id)}, {"$set": {"anomalyCheckins": user["anomalyCheckins"]}})
    
    anomaly = payload.dict()
    # Add anomaly to checkin
    col.update_one(
        {"_id": ObjectId(reservation_id)},
        {"$set": {"checkin.status": anomaly.get("status")}}
    )

    return True
    
    
    
    

@router.post(
    "/{reservation_id}/review",
    response_model=ReviewSubdoc,
    summary="5. Crear reseña tras check-in exitoso",
)
async def create_review(
    reservation_id: str,
    payload: ReviewSubdoc,
    db: Database = Depends(get_db),
):
    col = db["reservations"]
    res = col.find_one({"_id": ObjectId(reservation_id)})
    if not res or not res.get("checkin") or res["checkin"].get("status") != "completed":
        raise HTTPException(400, "Check-in no válido para reseñar")
    review = payload.dict()
    col.update_one(
        {"_id": ObjectId(reservation_id)},
        {"$set": {"checkin.review": review}}
    )
    return review 