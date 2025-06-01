"""
Script to generate embeddings for all events in the database.
This script will process each event, generate embeddings for their descriptions,
and store them in the eventEmbeddings collection.
"""

import os
import sys
from datetime import datetime
from typing import List
from dotenv import load_dotenv
from langchain_openai import AzureOpenAIEmbeddings
from bson import ObjectId

# Add the parent directory to Python path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.mongodb import get_mongo_client, get_database, get_events_collection
from models.EventEmbeddingModel import EventEmbeddingModel

# Load environment variables
load_dotenv()

# Initialize Azure OpenAI embeddings
embeddings = AzureOpenAIEmbeddings(model="text-embedding-3-large")

def generate_embedding(text: str) -> List[float]:
    """Generate embedding for given text using Azure OpenAI."""
    return embeddings.embed_query(text)

def get_all_events(db):
    """Get all events from the events collection."""
    events_collection = get_events_collection(db)
    return list(events_collection.find({}))

def check_existing_embedding(db, event_id: str) -> bool:
    """Check if embedding already exists for this event."""
    embeddings_collection = db.get_collection("eventEmbeddings")
    existing = embeddings_collection.find_one({"eventId": event_id})
    return existing is not None

def insert_event_embedding(db, event_embedding: EventEmbeddingModel):
    """Insert event embedding into the eventEmbeddings collection."""
    embeddings_collection = db.get_collection("eventEmbeddings")
    
    # Convert to dict and handle ObjectId
    embedding_dict = event_embedding.dict(by_alias=True)
    if '_id' in embedding_dict and isinstance(embedding_dict['_id'], str):
        embedding_dict['_id'] = ObjectId(embedding_dict['_id'])
    
    result = embeddings_collection.insert_one(embedding_dict)
    return result.inserted_id

def process_events():
    """Main function to process all events and generate embeddings."""
    
    # Get MongoDB connection
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        raise ValueError("MONGODB_URI environment variable is required")
    
    client = get_mongo_client(mongodb_uri)
    db = get_database(client)
    
    try:
        # Get all events
        events = get_all_events(db)
        print(f"Found {len(events)} events to process")
        
        processed = 0
        skipped = 0
        errors = 0
        
        for event in events:
            try:
                event_id = str(event.get("_id"))
                business_id = event.get("businessId", "")
                description = event.get("description", "")
                
                # Skip if description is empty
                if not description.strip():
                    print(f"Skipping event {event_id}: No description")
                    skipped += 1
                    continue
                
                # Check if embedding already exists
                if check_existing_embedding(db, event_id):
                    print(f"Skipping event {event_id}: Embedding already exists")
                    skipped += 1
                    continue
                
                print(f"Processing event {event_id}: {description[:50]}...")
                
                # Generate embedding for the description
                embedding_vector = generate_embedding(description)
                
                # Create EventEmbeddingModel instance
                event_embedding = EventEmbeddingModel(
                    eventId=event_id,
                    businessId=business_id,
                    description=description,
                    embedding=embedding_vector,
                    createdAt=datetime.utcnow(),
                    updatedAt=datetime.utcnow()
                )
                
                # Insert into database
                inserted_id = insert_event_embedding(db, event_embedding)
                print(f"✅ Successfully created embedding {inserted_id} for event {event_id}")
                processed += 1
                
            except Exception as e:
                print(f"❌ Error processing event {event.get('_id', 'unknown')}: {str(e)}")
                errors += 1
                continue
        
        # Print summary
        print(f"\n📊 Processing Summary:")
        print(f"✅ Processed: {processed}")
        print(f"⏭️  Skipped: {skipped}")
        print(f"❌ Errors: {errors}")
        print(f"📝 Total events: {len(events)}")
        
    except Exception as e:
        print(f"❌ Fatal error: {str(e)}")
        raise
    finally:
        client.close()

if __name__ == "__main__":
    print("🚀 Starting event embedding generation...")
    process_events()
    print("✨ Event embedding generation completed!")
