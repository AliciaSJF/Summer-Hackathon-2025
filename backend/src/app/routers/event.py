from fastapi import APIRouter, Depends, status, HTTPException
from pymongo.database import Database
from bson import ObjectId
from typing import List
from src.app.database.mongodb import get_database, get_mongo_client
from src.app.models.EventModel import EventModel, CreateEventModel, EventWithReservationModel, EventEmbeddingsResult
from dotenv import load_dotenv
import os
import numpy as np
from datetime import datetime

load_dotenv()

def id_length_check(id: str):
    """Check if ID is a string (>26 chars) or ObjectId (<=26 chars)"""
    if len(str(id)) > 26:
        return False  # String ID
    return True  # ObjectId

def get_collection(collection_name: str, db: Database):
    """Helper function to get collection from database"""
    return db.get_collection(collection_name)

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
    # Add latitude and longitude to the event: 40.515, -3.664
    new["latitude"] = 40.515
    new["longitude"] = -3.664
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
    response_model=List[EventEmbeddingsResult],
    summary="Obtener recomendaciones de eventos para un usuario",
)
async def get_recommendations(
    user_id: str,
    db: Database = Depends(get_db),
):
    # Obtenemos las reviews del usuario
    list_reviews = find_reviews_by_user(user_id, db)

    print(f"Reviews for user {user_id}: {len(list_reviews)} found")
    
    # Handle case where user has no reviews - provide general popular events
    if not list_reviews:
        print(f"No reviews found for user {user_id}, providing general recommendations")
        return get_popular_events(db)
    
    for review in list_reviews:
        print(f"Rating: {review['rating']}, Text: {review.get('text', 'N/A')}, eventId: {review['eventId']}")

    # Sacamos los embeddings de las descripciones de los eventos en la lista de reviews
    event_ids = list(set([review["eventId"] for review in list_reviews]))
    
    if not event_ids:
        print(f"No valid event IDs found in reviews for user {user_id}")
        return get_popular_events(db)

    events_embeddings = find_events_from_id(event_ids, db)
    
    if not events_embeddings:
        print(f"No embeddings found for events of user {user_id}")
        return get_popular_events(db)

    # Realizamos la agregación de los embeddings de los eventos utilizando tambien el valor del rating de la review
    aggregated_embedding = []
    for review, event_embedding in zip(list_reviews, events_embeddings):
        rating = review["rating"]
        # Normalizamos el rating a un rango de 0 a 1
        normalized_rating = (rating - 2.5) / (5.0 - 2.5)  # Asumiendo que el rating está entre 2.5 y 5.0
        weighted_embedding = [value * normalized_rating for value in event_embedding]
        aggregated_embedding.append(weighted_embedding)
    
    # Promedio de los embeddings agregados
    if not aggregated_embedding:
        print(f"No valid embeddings to aggregate for user {user_id}")
        return get_popular_events(db)
    
    average_embedding = np.mean(aggregated_embedding, axis=0)
    
    # Check for NaN values in the embedding
    if np.isnan(average_embedding).any():
        print(f"NaN values detected in average embedding for user {user_id}")
        return get_popular_events(db)
    
    average_embedding = average_embedding.tolist()
    print(f"Average Embedding for user {user_id}: computed successfully")

    # Buscamos reviews similares a la media de los embeddings que no sean las que ya tiene el usuario
    similar_events_results = find_similar_events(average_embedding, event_ids, db)
    print(f"Similar events for user {user_id}: {len(similar_events_results)} found")
    for event_result in similar_events_results:
        print(f"Event: {event_result.eventModel.description[:50]}..., Score: {event_result.score}")
        
    return similar_events_results

def get_popular_events(db: Database, limit: int = 10) -> List[EventEmbeddingsResult]:
    """
    Get popular events as fallback recommendations when user has no history.
    Returns recent events with default score.
    """
    events_collection = db["events"]
    
    # Get recent events, ordered by creation date
    recent_events = list(events_collection.find({})
                        .sort("createdAt", -1)
                        .limit(limit))
    
    results = []
    for event_doc in recent_events:
        # Convert MongoDB document to EventModel
        event_doc = convert_mongo_doc(event_doc)
        event_model = EventModel(**event_doc)
        
        # Create EventEmbeddingsResult with default score
        result = EventEmbeddingsResult(
            eventModel=event_model,
            score=0.5  # Default score for popular recommendations
        )
        results.append(result)
    
    return results

# Apartir de aquí, son helpers para el endpoint de recomendaciones
def find_reviews_Similar(bussinessId, query, db: Database):
    """
    Find reviews similar to a given query for a specific business.

    Args:
        bussinessId (str): The ID of the business to filter reviews.
        query (str): The text query to find similar reviews.
        db (Database): The MongoDB database instance.

    Returns:
        list: A list of similar reviews.
    """
    collection = db["reviewEmbeddings"]
    pipeline = [
        {
            "$vectorSearch": {
            "filter": {
                "businessId": bussinessId
            },
            "index": "embedding_vector_index_Reviews",
            "limit": 5,
            "numCandidates": 100,
            "path": "embedding",
            "queryVector": query
            }
        },
        {
        "$project": {
            "text": 1,
            "rating": 1,
            "score": {"$meta": "vectorSearchScore"}
        }
    }
    ]
    
    return list(collection.aggregate(pipeline))

def find_reviews_by_user(user_id, db: Database):
    """
    Find all reviews made by a specific user.

    Args:
        user_id (str): The ID of the user whose reviews are to be found.
        db (Database): The MongoDB database instance.

    Returns:
        list: A list of reviews made by the specified user.
    """
    collection = get_collection("eventEmbeddings", db)
    top_reviews = collection.find({"userId": user_id, "rating": {"$ne": None}}).sort("rating", -1).limit(5)
    return list(top_reviews)

def find_events_from_id(events_ids, db: Database):
    """
    Find events by their IDs.

    Args:
        events_ids (list): A list of event IDs to find.
        db (Database): The MongoDB database instance.

    Returns:
        list: A list of event embeddings matching the specified IDs.
    """
    collection = get_collection("eventEmbeddings", db)
    events = collection.find({"eventId": {"$in": events_ids}},
    {"embedding": 1, "_id": 0})

    return [event["embedding"] for event in events]

def find_similar_events(embedding, listEventIds, db: Database) -> List[EventEmbeddingsResult]:
    """
    Find events similar to a given embedding that are not in the list.
    Args:
        embedding (list): The embedding vector to find similar events.
        listEventIds (list): A list of event IDs to exclude from the search.
        db (Database): The MongoDB database instance.
    Returns:
        list: A list of EventEmbeddingsResult objects with events and their similarity scores.
    """
    collection = db["eventEmbeddings"]
    pipeline = [
        {
            "$vectorSearch": {
                "filter": {
                    "eventId": {"$nin": listEventIds}
                },
                "index": "embedding_vector_index_Events",
                "limit": 10,
                "numCandidates": 100,
                "path": "embedding",
                "queryVector": embedding
            }
        },
        {
            "$project": {
                "eventId": 1,
                "description": 1,
                "score": {"$meta": "vectorSearchScore"}
            }
        }
    ]
    
    embedding_results = list(collection.aggregate(pipeline))
    
    # Convert to EventEmbeddingsResult objects by fetching full event data
    results = []
    events_collection = db["events"]
    
    for embedding_result in embedding_results:
        event_id = embedding_result["eventId"]
        score = embedding_result["score"]
        
        # Fetch the full event data
        if id_length_check(event_id):
            event_doc = events_collection.find_one({"_id": ObjectId(event_id)})
        else:
            event_doc = events_collection.find_one({"_id": event_id})
            
        if event_doc:
            # Convert MongoDB document to EventModel
            event_doc = convert_mongo_doc(event_doc)
            event_model = EventModel(**event_doc)
            
            # Create EventEmbeddingsResult
            result = EventEmbeddingsResult(
                eventModel=event_model,
                score=score
            )
            results.append(result)
    
    return results