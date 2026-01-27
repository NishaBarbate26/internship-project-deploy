import os
import json
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

from firebase_admin import auth as firebase_auth
from config.firebase_admin import firebase_admin
from database.database import init_db
from services.itinerary_service import (
    save_itinerary,
    get_itineraries_by_user   # ✅ FIXED IMPORT
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
# CORS
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000"
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

# --------------------------------------------------
# Helper: Prompt Builder
# --------------------------------------------------
def build_itinerary_prompt(data: TravelPreferenceRequest) -> str:
    return f"""
You are a professional travel planner.
Return ONLY valid JSON.

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
    authorization: str = Header(None, alias="Authorization")
):
    if not genai_configured:
        raise HTTPException(status_code=500, detail="Google API key not configured")

    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="Authorization header missing")

        token = authorization.replace("Bearer ", "")
        decoded_token = firebase_auth.verify_id_token(token)

        user_email = decoded_token.get("email")
        if not user_email:
            raise HTTPException(status_code=401, detail="User email not found")

        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = build_itinerary_prompt(data)

        response = model.generate_content(prompt)
        raw_text = response.text.strip()

        if raw_text.startswith("```"):
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()

        start = raw_text.find("{")
        end = raw_text.rfind("}") + 1
        itinerary_json = json.loads(raw_text[start:end])

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

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/itineraries")
async def get_user_itineraries(
    authorization: str = Header(None, alias="Authorization")
):
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="Authorization header missing")

        token = authorization.replace("Bearer ", "")
        decoded_token = firebase_auth.verify_id_token(token)

        user_email = decoded_token.get("email")
        if not user_email:
            raise HTTPException(status_code=401, detail="Unauthorized")

        itineraries = get_itineraries_by_user(user_email)

        return {
            "success": True,
            "data": itineraries
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))