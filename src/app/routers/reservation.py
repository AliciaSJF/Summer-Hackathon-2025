from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from bson import ObjectId
from src.app.database.mongodb import get_database, get_mongo_client
from src.app.models.ReservationModel import ReservationModel, CheckinSubdoc, ReviewSubdoc

router = APIRouter(prefix="/reservations", tags=["reservations"])

def get_db() -> Database:
    client = get_mongo_client()
    return get_database(client)

@router.post(
    "",
    response_model=ReservationModel,
    status_code=status.HTTP_201_CREATED,
    summary="3. Pre-verificación y reserva",
)
async def create_reservation(
    payload: ReservationModel,
    db: Database = Depends(get_db),
):
    col = db["reservations"]
    new = payload.dict(by_alias=True)
    result = col.insert_one(new)
    new["_id"] = result.inserted_id
    return new

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
    updated_checkin = {
        "status": "completed",
        "requestedAt": None,
        "otpVerified": True,
        "locationVerified": True,
        "completedAt": None,
        "anomalies": [],
        "review": None,
    }
    col.update_one(
        {"_id": ObjectId(reservation_id)},
        {"$set": {"checkin": updated_checkin, "status": "completed"}}
    )
    return updated_checkin

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