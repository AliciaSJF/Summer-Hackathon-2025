from fastapi import APIRouter, Depends, status, HTTPException
from pymongo.database import Database
from bson import ObjectId
from typing import List
from src.app.database.mongodb import get_database, get_mongo_client
from src.app.models.EventModel import EventModel, CreateEventModel
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

router = APIRouter(prefix="/businesses/{business_id}/events", tags=["events"])

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

@router.post(
    "",
    response_model=EventModel,
    status_code=status.HTTP_201_CREATED,
    summary="2. Crear un nuevo evento/cita",
)
async def create_event(
    business_id: str,
    payload: CreateEventModel,
    db: Database = Depends(get_db),
):
    col = db["events"]
    payload.businessId = business_id
    new = payload.dict(by_alias=True)
    result = col.insert_one(new)
    
    # Convert ObjectId to string for the response
    new["_id"] = str(result.inserted_id)
    
    # Add createdAt if not present
    if "createdAt" not in new:
        new["createdAt"] = datetime.utcnow()
    
    return new

@router.get(
    "",
    response_model=List[EventModel],
    summary="3. Obtener todos los eventos de un negocio",
)
async def get_events_by_business(
    business_id: str,
    db: Database = Depends(get_db),
):
    col = db["events"]
    events = list(col.find({"businessId": business_id}))
    return convert_mongo_docs(events)

@router.get(
    "/{event_id}",
    response_model=EventModel,
    summary="4. Obtener un evento por ID",
)
async def get_event_by_id(
    business_id: str,
    event_id: str,
    db: Database = Depends(get_db),
):
    col = db["events"]
    # Since EventModel uses string IDs (uuid4), not ObjectIds
    event = col.find_one({"_id": event_id, "businessId": business_id})
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    return convert_mongo_doc(event)

@router.put(
    "/{event_id}",
    response_model=EventModel,
    summary="5. Actualizar un evento",
)
async def update_event(
    business_id: str,
    event_id: str,
    payload: EventModel,
    db: Database = Depends(get_db),
):
    col = db["events"]
    
    # Check if event exists and belongs to the business
    existing_event = col.find_one({"_id": event_id, "businessId": business_id})
    if not existing_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Ensure the businessId matches
    payload.businessId = business_id
    update_data = payload.dict(by_alias=True, exclude={"id"})
    
    result = col.update_one(
        {"_id": event_id, "businessId": business_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event update failed"
        )
    
    updated_event = col.find_one({"_id": event_id, "businessId": business_id})
    return convert_mongo_doc(updated_event)

# Obtener todos los eventos
# Separate router for getting all events across all businesses
all_events_router = APIRouter(prefix="/events", tags=["events"])

@all_events_router.get(
    "",
    response_model=List[EventModel],
    summary="6. Obtener todos los eventos",
)
async def get_all_events(
    db: Database = Depends(get_db),
):
    col = db["events"]
    events = list(col.find({}))
    return convert_mongo_docs(events)

