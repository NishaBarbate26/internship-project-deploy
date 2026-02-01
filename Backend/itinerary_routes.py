import json
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
import google.generativeai as genai

from Backend.database.database import SessionLocal
from models import Itinerary
from schemas import TravelPreferenceRequest

# Import the new services
from Backend.services.export_service import generate_itinerary_markdown
from Backend.services.itinerary_service import delete_itinerary, get_itinerary_by_id

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
def generate_itinerary(data: TravelPreferenceRequest, db: Session = Depends(get_db)):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        response = model.generate_content(build_prompt(data))

        # Handle potential markdown code blocks in AI response
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = (
                response_text.replace("```json", "").replace("```", "").strip()
            )

        itinerary_json = json.loads(response_text)

        itinerary = Itinerary(
            destination=data.destination,
            preferences=data.dict(),
            itinerary=itinerary_json,
        )

        db.add(itinerary)
        db.commit()
        db.refresh(itinerary)

        return {"success": True, "itinerary_id": itinerary.id, "data": itinerary_json}

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/itineraries/{itinerary_id}/export")
def export_itinerary(itinerary_id: int, user_email: str, db: Session = Depends(get_db)):
    """
    Retrieves itinerary, formats it as Markdown, and returns it as a downloadable file.
    """
    # Fetch using the existing service logic for ownership check
    itinerary_data = get_itinerary_by_id(itinerary_id, user_email)

    if not itinerary_data:
        raise HTTPException(
            status_code=404, detail="Itinerary not found or access denied"
        )

    # Format the data for the markdown generator
    formatted_data = {
        "title": f"Trip to {itinerary_data['destination']}",
        "destination": itinerary_data["destination"],
        "dates": f"{itinerary_data['start_date']} to {itinerary_data['end_date']}",
        "preferences": itinerary_data["preferences"],
        "itinerary_plan": itinerary_data["itinerary"].get("days", []),
    }

    markdown_content = generate_itinerary_markdown(formatted_data)

    filename = f"itinerary_{itinerary_id}.md"

    return Response(
        content=markdown_content,
        media_type="text/markdown",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.delete("/api/itineraries/{itinerary_id}")
def remove_itinerary(itinerary_id: int, user_email: str):
    """
    Deletes the itinerary and linked chat history.
    """
    success = delete_itinerary(itinerary_id, user_email)

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Itinerary not found or you do not have permission to delete it",
        )

    return {
        "success": True,
        "message": "Itinerary and chat history deleted successfully",
    }
