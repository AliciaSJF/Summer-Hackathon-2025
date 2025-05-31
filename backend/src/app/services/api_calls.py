from opengateway_sandbox_sdk import ClientCredentials
import requests
from opengateway_sandbox_sdk import NumberVerification,DeviceLocation
from .open_gatewayt_auth import get_access_token_from_auth_req_id, request_authorization

OGW_BASE = "https://sandbox.opengateway.telefonica.com/apigateway"

credentials = ClientCredentials(
    client_id = "0f57c7b9-9d68-497d-95ea-5ed4e589484c",
    client_secret = "5f7e0446-5c2b-4307-b1ad-b26f833009be"
)

def call_api(phone: str, scope: str) -> dict:
    print("Llamando a la API con el teléfono:", phone, "y el scope:", scope)
    auth_req_id = request_authorization(scope=scope, phone=phone)
    print("auth_req_id:", auth_req_id)
    if not auth_req_id:
        print("❌ No se pudo obtener auth_req_id")
        raise Exception("No se pudo obtener auth_req_id")
    token = get_access_token_from_auth_req_id(auth_req_id)

    if scope == "dpv:ResearchAndDevelopment#kyc-match:match":
        result = run_kyc_match(token=token)

async def verify_location(phone:str , code:str) -> dict:
    print("Verificando ubicación del número:", phone, "con código:", code)
    client = DeviceLocation(credentials=credentials, phone_number=phone)
    #result = client.verify(40.5150, -3.6640, 10, phone)
    result = client.verify(40.442242,-3.697463, 2, phone)
    print("Resultado de verificación de ubicación:", result)
    return result

async def verify_number(code: str, phone: str) -> dict:
    print("Verificando número:", phone, "con código:", code)
    client = NumberVerification(credentials, code)
    result = await client.verify(phone)
    return result.to_dict()

fake_user_data = {
    "name": "Mario López Pérez",
    "givenName": "Mario",
    "familyName": "López Pérez",
    "nameKanaHankaku": "mario",
    "nameKanaZenkaku": "Ｍａｒｉｏ",
    "middleNames": "José",
    "familyNameAtBirth": "Pérez",
    "country": "ES",
    "birthdate": "1990-01-15",
    "email": "mario.lopez@example.com",
    "gender": "MALE"
}

def run_kyc_match(token: str):
    url = "https://sandbox.opengateway.telefonica.com/apigateway/kyc-match/v0.2/match"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    user_data = fake_user_data
    response = requests.post(url, json=user_data, headers=headers)

    if response.status_code != 200:
        raise Exception(f"❌ Error {response.status_code}: {response.text}")

    result = response.json()
    print("✅ KYC match result:")
    print(result)

    # Devuelve solo los campos que han fallado (valor "false")
    failed_fields = {k: v for k, v in result.items() if v == "false"}
    print("Campos que han fallado:", failed_fields)
    return failed_fields


def get_failed_kyc_fields(kyc_result: dict) -> dict:
    return {k: v for k, v in kyc_result.items() if v == "false"}
