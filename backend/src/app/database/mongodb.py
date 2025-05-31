from pymongo.database import Database
from pymongo.mongo_client import MongoClient

def get_database(client: MongoClient)-> Database:
    """
    Get the MongoDB database instance.
    
    :param client: MongoClient instance
    :return: Database instance
    """
    return client.get_database("reputation_system")

def get_mongo_client(uri: str) -> MongoClient:
    """
    Create a MongoDB client using the provided URI.
    
    :param uri: MongoDB connection URI
    :return: MongoClient instance
    """
    return MongoClient(uri)

def get_users_collection(db: Database):
    return db.get_collection("users")

def get_businesses_collection(db: Database):
    return db.get_collection("businesses")

def get_events_collection(db: Database):
    return db.get_collection("events")

def get_reservations_collection(db: Database):
    return db.get_collection("reservations")

def get_review_embeddings_collection(db: Database):
    return db.get_collection("reviewEmbeddings")