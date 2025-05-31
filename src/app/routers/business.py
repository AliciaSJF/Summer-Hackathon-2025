from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from bson import ObjectId
from src.app.database.mongodb import get_database, get_mongo_client
from src.app.models.BusinessModel import BusinessModel

router = APIRouter(prefix="/businesses", tags=["businesses"])

def get_db() -> Database:
    client = get_mongo_client()
    return get_database(client)

@router.post(
    "/register",
    response_model=BusinessModel,
    status_code=status.HTTP_201_CREATED,
    summary="1. Registro de nueva empresa",
)
async def register_business(
    payload: BusinessModel,
    db: Database = Depends(get_db),
):
    col = db["businesses"]
    new = payload.dict(by_alias=True)
    result = col.insert_one(new)
    new["_id"] = result.inserted_id
    return new

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