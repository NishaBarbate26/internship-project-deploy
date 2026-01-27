from pydantic import BaseModel
from typing import List, Optional

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
