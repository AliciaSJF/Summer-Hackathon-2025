from fastapi import APIRouter, Depends, status, HTTPException
from pymongo.database import Database
from bson import ObjectId
from typing import List
from src.app.database.mongodb import get_database, get_mongo_client
from src.app.models.EventModel import EventModel, CreateEventModel, EventWithReservationModel
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

def id_length_check(id: str):
    """Check if ID is a string (>26 chars) or ObjectId (<=26 chars)"""
    if len(str(id)) > 26:
        return False  # String ID
    return True  # ObjectId

router = APIRouter(prefix="/businesses/{business_id}/events", tags=["events"])

def get_db() -> Database:
    uri = os.getenv("MONGODB_URI")
    client = get_mongo_client(uri)
    return get_database(client)

def convert_mongo_doc(doc):
    """Convert MongoDB document to format expected by Pydantic models"""
    if doc:
        # Convert _id field
        if "_id" in doc:
            doc["_id"] = str(doc["_id"])
        
        # Convert businessId field if it's an ObjectId
        if "businessId" in doc and isinstance(doc["businessId"], ObjectId):
            doc["businessId"] = str(doc["businessId"])
    
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
    if not id_length_check(event_id):
        event = col.find_one({"_id": event_id, "businessId": business_id})
    else:
        event = col.find_one({"_id": ObjectId(event_id), "businessId": business_id})
        
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

# Get evento by id
@all_events_router.get(
    "/{event_id}",
    response_model=EventModel,
    summary="Obtener evento por ID",
)
async def get_event_by_id(
    event_id: str,
    db: Database = Depends(get_db),
):
    col = db["events"]
    if not id_length_check(event_id):
        event = col.find_one({"_id": event_id})
    else:
        event = col.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    return convert_mongo_doc(event)


# Get all events for a user by user id from reservations
@all_events_router.get(
    "/user/{user_id}",
    response_model=List[EventModel],
    summary="Obtener todos los eventos de un usuario por su ID",
)
async def get_events_for_user(
    user_id: str,
    db: Database = Depends(get_db),
):
    reservations_col = db["reservations"]
    events_col = db["events"]

    # Find all reservations for the user
    reservations = list(reservations_col.find({"userId": user_id}))
    event_ids = [res.get("eventId") for res in reservations if res.get("eventId")]

    if not event_ids:
        return []

    # Separate by ID type
    string_ids = []    # For UUID strings (>26 chars)
    object_ids = []    # For ObjectIds (<=26 chars)

    for event_id in event_ids:
        if id_length_check(event_id):
            object_ids.append(ObjectId(event_id))  # Convert to ObjectId
        else:
            string_ids.append(event_id)            # Keep as string

    # Query separately
    if string_ids:
        string_events = events_col.find({"_id": {"$in": string_ids}})
    if object_ids:  
        object_events = events_col.find({"_id": {"$in": object_ids}})

    # Combine results
    events = []
    if string_ids:
        string_events = list(string_events)
        events.extend(string_events)
    if object_ids:
        object_events = list(object_events)
        events.extend(object_events)

    return convert_mongo_docs(events)

@all_events_router.get(
    "/user/{user_id}/reservations",
    response_model=List[EventWithReservationModel],
    summary="Obtener todos los eventos de un usuario por su ID",
)
async def get_events_for_user(
    user_id: str,
    db: Database = Depends(get_db),
):
    reservations_col = db["reservations"]
    events_col = db["events"]

    # Find all reservations for the user - get both eventId and reservation _id
    reservations = list(reservations_col.find(
        {"userId": user_id}
    ))
    print("reservations:", len(reservations))
    
    if not reservations:
        return []

    # Extract unique event IDs to minimize database queries 
    event_ids = list([res.get("eventId") for res in reservations if res.get("eventId")])
    
    if not event_ids:
        return []

    # Separate by ID type
    string_ids = []    # For UUID strings (>26 chars)
    object_ids = []    # For ObjectIds (<=26 chars)

    for event_id in event_ids:
        if id_length_check(event_id):
            object_ids.append(ObjectId(event_id))  # Convert to ObjectId
        else:
            string_ids.append(event_id)            # Keep as string

    # Query separately
    if string_ids:
        string_events = events_col.find({"_id": {"$in": string_ids}})
    if object_ids:  
        object_events = events_col.find({"_id": {"$in": object_ids}})

    # Combine results
    events = []
    if string_ids:
        string_events = list(string_events)
        events.extend(string_events)
    if object_ids:
        object_events = list(object_events)
        events.extend(object_events)
    
    # Convert events to dict for easy lookup by eventId
    events_dict = {}
    for event in events:
        event_converted = convert_mongo_doc(event)
        events_dict[event_converted["_id"]] = event_converted
    
    # Create the paired list: each reservation gets paired with its event
    events_with_reservation_id = []
    for reservation in reservations:
        event_id = reservation.get("eventId")
        reservation_id = str(reservation.get("_id"))
        
        if event_id in events_dict:
            event_data = events_dict[event_id]
            
            # Create the paired structure
            paired_data = {
                **event_data,  # Include all event fields
                "event": event_data,  # Also include as nested event object
                "reservation_id": reservation_id
            }
            events_with_reservation_id.append(paired_data)
    print(len(events_with_reservation_id))
    return events_with_reservation_id

# Endpoint for personal recommendations with GenAI
@all_events_router.get(
    "/recommendations/{user_id}",
    response_model=List[EventModel],
    summary="Obtener recomendaciones de eventos para un usuario",
)
async def get_recommendations(
    user_id: str,
    db: Database = Depends(get_db),
):
    pass