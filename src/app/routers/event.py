from fastapi import APIRouter, Depends, status
from pymongo.database import Database
from bson import ObjectId
from src.app.database.mongodb import get_database, get_mongo_client
from src.app.models.EventModel import EventModel

router = APIRouter(prefix="/businesses/{business_id}/events", tags=["events"])

def get_db() -> Database:
    client = get_mongo_client()
    return get_database(client)

@router.post(
    "",
    response_model=EventModel,
    status_code=status.HTTP_201_CREATED,
    summary="2. Crear un nuevo evento/cita",
)
async def create_event(
    business_id: str,
    payload: EventModel,
    db: Database = Depends(get_db),
):
    col = db["events"]
    payload.businessId = business_id
    new = payload.dict(by_alias=True)
    result = col.insert_one(new)
    new["_id"] = result.inserted_id
    return new 