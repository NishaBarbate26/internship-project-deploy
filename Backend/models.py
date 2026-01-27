from sqlalchemy import Column, Integer, String, JSON, DateTime
from datetime import datetime
from Backend.database.database import Base

class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True, index=True)
    destination = Column(String, index=True)
    preferences = Column(JSON)
    itinerary = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
