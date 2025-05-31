from pymongo import MongoClient, ASCENDING
from pymongo.errors import CollectionInvalid, OperationFailure
from pymongo.operations import SearchIndexModel
from datetime import datetime

# --------------------------------------------------------
# 1. Conexión a MongoDB
# --------------------------------------------------------
# Sustituye por tu URI (puede ser local o Atlas)
MONGO_URI = "mongodb://localhost:27017"  # :contentReference[oaicite:2]{index=2}

client = MongoClient(MONGO_URI)
db = client["reputation_system"]  # Nombre de la base de datos

# --------------------------------------------------------
# 2. Creación de colecciones (si no existen)
# --------------------------------------------------------
collections = ["users", "businesses", "events", "reservations", "reviewEmbeddings", "eventEmbeddings"]
for coll_name in collections:
    try:
        db.create_collection(coll_name)
        print(f"Colección '{coll_name}' creada satisfactoriamente.")
    except CollectionInvalid:
        print(f"Colección '{coll_name}' ya existe.")
    except Exception as e:
        print(f"Error al crear colección '{coll_name}': {e}")
        
# --------------------------------------------------------
# 3. Índices básicos para las colecciones principales
# --------------------------------------------------------

# 3.1 users: índice único en 'mobile'
try:
    db.users.create_index([("mobile", ASCENDING)], unique=True, name="idx_users_mobile")
    print("Índice único creado en 'users.mobile'.")
except Exception as e:
    print(f"Error al crear índice en 'users.mobile': {e}")

# 3.2 businesses: índice único en 'apiKey'
try:
    db.businesses.create_index([("apiKey", ASCENDING)], unique=True, name="idx_businesses_apiKey")
    print("Índice único creado en 'businesses.apiKey'.")
except Exception as e:
    print(f"Error al crear índice en 'businesses.apiKey': {e}")

# 3.3 events: índice en 'businessId' para consultas rápidas
try:
    db.events.create_index([("businessId", ASCENDING)], name="idx_events_businessId")
    print("Índice creado en 'events.businessId'.")
except Exception as e:
    print(f"Error al crear índice en 'events.businessId': {e}")

# 3.4 reservations: índices en 'eventId' y 'userId'
try:
    db.reservations.create_index([("eventId", ASCENDING)], name="idx_reservations_eventId")
    db.reservations.create_index([("userId", ASCENDING)], name="idx_reservations_userId")
    print("Índices creados en 'reservations.eventId' y 'reservations.userId'.")
except Exception as e:
    print(f"Error al crear índices en 'reservations': {e}")
    
# --------------------------------------------------------
# 4. Configuración de Vector Search en 'reviewEmbeddings'
# --------------------------------------------------------
# Sólo aplicable si usas MongoDB Atlas con Vector Search habilitado (4.7+ PyMongo).
# :contentReference[oaicite:3]{index=3}:contentReference[oaicite:4]{index=4}
# VECTOR_DIMENSIONS = 1536  # Dimensiones del vector, ajusta según tu modelo
# # Asegúrate de que tu MongoDB Atlas tiene habilitado Vector Search.
# # Si no estás usando MongoDB Atlas o no tienes Vector Search, este paso no es necesario.



# # Creamos (o actualizamos) el índice en la colección 'reviewEmbeddings'
# try:
#     db.reviewEmbeddings.create_index(
#         [("embedding", "vector")],
#         name="idx_review_embeddings_vector",
#         vector_search_config={
#             "dimensions": 1536,  # Cambia según el tamaño de tu embedding
#             "distance_metric": "cosine"
#         }
#     )
#     print("Índice de búsqueda vectorial creado en 'reviewEmbeddings.embedding'.")
# except OperationFailure as e:   
#     if "already exists" in str(e):
#         print("El índice de búsqueda vectorial ya existe en 'reviewEmbeddings.embedding'.")
#     else:
#         print(f"Error al crear índice de búsqueda vectorial: {e}")


# --------------------------------------------------------
# 5. Índices adicionales para búsquedas de texto (opcional)
# --------------------------------------------------------
# Si quieres agregar búsquedas de texto en los comentarios de review, 
# podrías crear un índice de texto en 'reservations.checkin.review.comment'.
# No es estricto en este momento; se deja como comentario de ejemplo.

# try:
#     db.reservations.create_index(
#         [("checkin.review.comment", "text")],
#         name="idx_reservations_review_text"
#     )
#     print("Índice de texto creado en 'reservations.checkin.review.comment'.")
# except Exception as e:
#     print(f"Error al crear índice de texto: {e}")

print("🏁 Configuración de colecciones e índices completada.")