from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from bson import ObjectId
from src.app.database.mongodb import get_database, get_mongo_client
from src.app.models.BusinessModel import CreateBusinessModel, BusinessModel, BusinessDetailsModel
from src.app.database.mongodb import get_businesses_collection 
from dotenv import load_dotenv
from langchain_openai import AzureOpenAIEmbeddings, AzureChatOpenAI
import os

load_dotenv()

router = APIRouter(prefix="/businesses", tags=["businesses"])

def get_db() -> Database:
    uri = os.getenv("MONGODB_URI")
    client = get_mongo_client(uri)
    return get_database(client)

@router.post(
    "/register",
    response_model=BusinessModel,
    status_code=status.HTTP_201_CREATED,
    summary="1. Registro de nueva empresa",
)
async def register_business(
    payload: CreateBusinessModel,
    db: Database = Depends(get_db),
):
    col = db["businesses"]
    print("Payload", payload)
    new = payload.dict(by_alias=True)
    
    print("Inserting...")
    # Remove '_id' if present, so MongoDB generates it automatically
    new.pop("_id", None)
    result = col.insert_one(new)
    print("Inserted.")
    # Fetch the inserted document to return with all fields (including generated _id)
    inserted = col.find_one({"_id": result.inserted_id})
    return inserted

@router.get(
    "/by-apikey/{api_key}",
    response_model=BusinessDetailsModel,
    summary="Obtener detalles de negocio por API Key",
)
async def get_business_by_apikey(
    api_key: str,
    db: Database = Depends(get_db),
):
    business = get_businesses_collection(db).find_one({"apiKey": api_key})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business


@router.get(
    "/{business_id}",
    response_model=BusinessDetailsModel,
    summary="Obtener detalles de negocio",
)
async def get_business_details(
    business_id: str,
    db: Database = Depends(get_db),
):
    business = get_businesses_collection(db).find_one({"_id": ObjectId(business_id)})
    print("Business", business)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business


@router.get(
    "/reputation/{business_id}",
    summary="6. Obtener reputación de negocio",
)
async def get_business_reputation(
    business_id: str,
    db: Database = Depends(get_db),
):
    return {"business_id": business_id, "score": 0.0, "breakdown": {}}

@router.get(
    "/analytics/{business_id}",
    summary="8. Estadísticas y dashboard para un negocio",
)
async def get_business_analytics(
    business_id: str,
    db: Database = Depends(get_db),
):
    return {"business_id": business_id, "analytics": {}}

@router.get(
    "/site-selection/{business_id}",
    summary="8. Site-Selection: sugerir nuevas ubicaciones",
)
async def get_site_selection(
    business_id: str,
    db: Database = Depends(get_db),
):
    return {"business_id": business_id, "top_locations": []} 

@router.get(
    "/reviews_analysys/{business_id}",
    summary="7. Análisis de reviews de negocio",
)
async def get_business_reviews_analysis(
    business_id: str,
    category: str,
    db: Database = Depends(get_db),
):
   
    #Modelo Embeddings
    embeddings = AzureOpenAIEmbeddings(model="text-embedding-3-large")
    #Modelo de lenguaje
    llm = AzureChatOpenAI(model="gpt-4o-mini", temperature=0.2, streaming=True)

    #Diccionario de Categorías y el prompt para el modelo de lenguaje
    categorias={
        "Ambiente": "Quiero saber cómo se percibe mi negocio en términos de ambiente, incluyendo aspectos como limpieza, decoración, y comodidad.",
        "Seguridad": " Quiero saber cómo se percibe mi negocio en términos de seguridad, incluyendo la percepción de los clientes sobre la seguridad física y la protección de datos.",
        "Atención al Cliente": "Quiero saber cómo se percibe mi negocio en términos de atención al cliente, incluyendo la amabilidad, rapidez y eficacia del servicio.",
    }

    #Datos que se pasan desde fuera
    businessId = business_id
    categoria = category
    if categoria not in categorias:
        raise HTTPException(status_code=400, detail="Categoría no válida. Debe ser una de las siguientes: 'Ambiente', 'Seguridad', 'Atención al Cliente'.")
    if not businessId:
        raise HTTPException(status_code=400, detail="Business not found")
    
    #Obtenemos la lista de reviews similares
    query_embedding = embeddings.embed_query(categorias[categoria])  
    col = db["reviewEmbeddings"]
    pipeline = [
        {
            "$vectorSearch": {
            "filter": {
                "businessId": businessId
            },
            "index": "embedding_vector_index_Reviews",# TODO: CAMBIAR
            "limit": 5,
            "numCandidates": 100,
            "path": "embedding",
            "queryVector": query_embedding
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
    list_reviews = list(col.aggregate(pipeline))


    #Nos quedamos con la lista de reviews solo el texto y solo si el score es mayor a 0.5
    list_reviews = [f"{review['text']}" for review in list_reviews if review['score'] > 0.5]

    # Generamos el prompt para el modelo de lenguaje
    prompt = f"""
        Eres un experto en análisis de opiniones de clientes. Tu tarea es analizar las opiniones de los clientes sobre un negocio específico y proporcionar un resumen detallado de la percepción del cliente en una categoría específica.

        Categoría: {categoria}
        Descripción de la categoría: {categorias[categoria]}
        
        Aquí tienes una lista de opiniones de clientes sobre el negocio:
        {list_reviews}

        Por favor, proporciona un resumen detallado de la percepción del cliente en la categoría '{categoria}'.
    """
    # Ejecutamos el modelo de lenguaje con el prompt generado
    response = llm.invoke(prompt)
    # Imprimimos la respuesta del modelo de lenguaje
    print("Respuesta del modelo de lenguaje:")
    print(response.content)
    return response.content





    #@router.post(
    #    "/reviews/{business_id}",
    #    db: Database = Depends(get_db),
    #):
    #async def get_business_reviews(
    #    db: Database = Depends(get_db),
    #    business_id: str,
    #):
        