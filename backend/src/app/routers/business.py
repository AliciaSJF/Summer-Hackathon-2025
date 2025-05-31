from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from bson import ObjectId
from src.app.database.mongodb import get_database, get_mongo_client
from src.app.models.BusinessModel import CreateBusinessModel, BusinessModel, BusinessDetailsModel
from src.app.database.mongodb import get_businesses_collection 

router = APIRouter(prefix="/businesses", tags=["businesses"])

def get_db() -> Database:
    client = get_mongo_client("mongodb+srv://hackathon:mD8Et6rE6DZfLUe6@cluster0.9ols995.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
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


#@router.post(
#    "/reviews/{business_id}",
#    db: Database = Depends(get_db),
#):
#async def get_business_reviews(
#    db: Database = Depends(get_db),
#    business_id: str,
#):
    