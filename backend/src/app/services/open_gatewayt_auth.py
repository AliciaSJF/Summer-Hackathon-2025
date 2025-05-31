
import requests
import os
import logging
import time
import os
import urllib.parse
import httpx
import base64
logger = logging.getLogger(__name__)

OGW_BASE = "https://sandbox.opengateway.telefonica.com/apigateway"
CLIENT_ID = "0f57c7b9-9d68-497d-95ea-5ed4e589484c"
CLIENT_SECRET = "5f7e0446-5c2b-4307-b1ad-b26f833009be"
AUTH = (CLIENT_ID, CLIENT_SECRET)
HEADERS = {"Content-Type": "application/x-www-form-urlencoded"}
SCOPE = "dpv:ResearchAndDevelopment#kyc-match:match"
REDIRECT_URI = "https://cuatro.studio/ogw/callback"


def request_authorization(scope: str, phone: str = "") -> dict:
    print("Solicitando autorización para el teléfono:", phone)
    client_id = "0f57c7b9-9d68-497d-95ea-5ed4e589484c"
    client_secret = "5f7e0446-5c2b-4307-b1ad-b26f833009be"

    auth = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth}",
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "login_hint": "tel:+34636260852",  
        #"scope": "dpv:FraudPreventionAndDetection#device-location-read"
        #"scope": "dpv:ResearchAndDevelopment#kyc-match:match"
        scope: scope
    }

    response = httpx.post("https://sandbox.opengateway.telefonica.com/apigateway/bc-authorize",
                        headers=headers, data=data)
    print("response:", response.text)
    auth_req_id = response.json().get("auth_req_id")
    return auth_req_id

def get_access_token_from_auth_req_id(auth_req_id: str) -> str:
    client_id = "0f57c7b9-9d68-497d-95ea-5ed4e589484c"
    client_secret = "5f7e0446-5c2b-4307-b1ad-b26f833009be"

    auth = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth}",
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {
        "grant_type": "urn:openid:params:grant-type:ciba",
        "auth_req_id": auth_req_id
    }

    response = httpx.post(
        "https://sandbox.opengateway.telefonica.com/apigateway/token",
        headers=headers,
        data=data
    )
    token_data = response.json()
    if response.status_code != 200:
        raise Exception(f"Error al obtener el access_token: {response.status_code} - {response.text}")

    token_data = response.json()
    return token_data["access_token"]