import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import google.generativeai as genai

from Backend.database.database import SessionLocal
from models import Itinerary
from schemas import TravelPreferenceRequest

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def build_prompt(data: TravelPreferenceRequest):
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
  "overview": "summary",
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

@router.post("/api/generate-itinerary")
def generate_itinerary(
    data: TravelPreferenceRequest,
    db: Session = Depends(get_db)
):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(build_prompt(data))

        itinerary_json = json.loads(response.text)

        itinerary = Itinerary(
            destination=data.destination,
            preferences=data.dict(),
            itinerary=itinerary_json
        )

        db.add(itinerary)
        db.commit()
        db.refresh(itinerary)

        return {
            "success": True,
            "itinerary_id": itinerary.id,
            "data": itinerary_json
        }

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
