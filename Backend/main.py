import os
import json
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from dotenv import load_dotenv

import google.generativeai as genai
from firebase_admin import auth as firebase_auth
from fastapi.openapi.utils import get_openapi

from config.firebase_admin import firebase_admin
from database.database import init_db
from services.itinerary_service import (
    save_itinerary,
    get_itineraries_by_user,
    get_itinerary_by_id,
    process_chat_and_update,
    get_chat_history
)

# --------------------------------------------------
# Load environment variables
# --------------------------------------------------
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("Warning: GOOGLE_API_KEY not found")
    genai_configured = False
else:
    genai.configure(api_key=api_key)
    genai_configured = True

# --------------------------------------------------
# FastAPI App
# --------------------------------------------------
app = FastAPI(title="Backend API", version="0.1.0")

# --------------------------------------------------
# Swagger + Firebase Bearer Auth
# --------------------------------------------------
bearer_scheme = HTTPBearer(auto_error=True)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Backend API",
        version="0.1.0",
        description="FastAPI Backend with Firebase Authentication",
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "FirebaseBearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    for path in openapi_schema["paths"].values():
        for method in path.values():
            method["security"] = [{"FirebaseBearer": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# --------------------------------------------------
# CORS
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:4173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Schemas
# --------------------------------------------------
class TravelPreferenceRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    travel_style: str
    food_preferences: List[str]
    interests: List[str]
    budget: str
    group_size: int
    special_requirements: Optional[str] = None


class ChatMessageRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    success: bool
    response_message: str
    updated_itinerary: dict
    chat_history: List[dict]

# --------------------------------------------------
# Helper: Prompt Builder
# --------------------------------------------------
def build_itinerary_prompt(data: TravelPreferenceRequest) -> str:
    return f"""
You are a professional travel planner. Return ONLY valid JSON.

Destination: {data.destination}
Dates: {data.start_date} to {data.end_date}
Travel style: {data.travel_style}
Food preferences: {", ".join(data.food_preferences)}
Interests: {", ".join(data.interests)}
Budget: {data.budget}
Group size: {data.group_size}
Special requirements: {data.special_requirements}

JSON format:
{{
  "overview": "short summary",
  "days": [
    {{
      "day": 1,
      "title": "",
      "morning": "",
      "afternoon": "",
      "evening": "",
      "food": "",
      "notes": ""
    }}
  ]
}}
"""

# --------------------------------------------------
# Startup
# --------------------------------------------------
@app.on_event("startup")
async def startup_event():
    init_db()

# --------------------------------------------------
# Routes
# --------------------------------------------------
@app.post("/api/generate-itinerary")
async def generate_itinerary(
    data: TravelPreferenceRequest,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    if not genai_configured:
        raise HTTPException(status_code=500, detail="Google API key not configured")

    try:
        decoded_token = firebase_auth.verify_id_token(credentials.credentials)
        user_email = decoded_token.get("email")

        if not user_email:
            raise HTTPException(status_code=401, detail="Unauthorized")

        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = build_itinerary_prompt(data)
        response = model.generate_content(prompt)

        raw_text = response.text.strip()
        if raw_text.startswith("```"):
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()

        itinerary_json = json.loads(raw_text[raw_text.find("{"): raw_text.rfind("}") + 1])

        itinerary_id = save_itinerary(
            user_id=user_email,
            destination=data.destination,
            start_date=data.start_date,
            end_date=data.end_date,
            preferences=data.dict(),
            itinerary=itinerary_json
        )

        return {
            "success": True,
            "message": "Itinerary generated successfully",
            "data": {
                "itinerary_id": itinerary_id,
                "user_email": user_email,
                "itinerary": itinerary_json
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/itineraries")
async def get_user_itineraries(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    decoded_token = firebase_auth.verify_id_token(credentials.credentials)
    user_email = decoded_token.get("email")

    if not user_email:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return {
        "success": True,
        "data": get_itineraries_by_user(user_email)
    }


@app.get("/api/itineraries/{itinerary_id}")
async def get_single_itinerary(
    itinerary_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    decoded_token = firebase_auth.verify_id_token(credentials.credentials)
    user_email = decoded_token.get("email")

    itinerary = get_itinerary_by_id(itinerary_id, user_email)
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    return {"success": True, "data": itinerary}


@app.post("/api/itineraries/{itinerary_id}/chat", response_model=ChatResponse)
async def chat_with_itinerary(
    itinerary_id: int,
    chat_data: ChatMessageRequest,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    decoded_token = firebase_auth.verify_id_token(credentials.credentials)
    user_email = decoded_token.get("email")

    result = process_chat_and_update(
        itinerary_id=itinerary_id,
        user_email=user_email,
        user_message=chat_data.message
    )

    return {
        "success": True,
        "response_message": result["response_message"],
        "updated_itinerary": result["updated_itinerary"],
        "chat_history": result["chat_history"]
    }


@app.get("/api/itineraries/{itinerary_id}/chat")
async def get_itinerary_chat_history(
    itinerary_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    decoded_token = firebase_auth.verify_id_token(credentials.credentials)
    user_email = decoded_token.get("email")

    itinerary = get_itinerary_by_id(itinerary_id, user_email)
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    return {
        "success": True,
        "data": get_chat_history(itinerary_id)
    }
