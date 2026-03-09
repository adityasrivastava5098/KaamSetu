from pydantic import BaseModel, Field, conlist
from typing import List, Optional
from datetime import datetime

# Schema for Worker Signup
class WorkerCreateRequest(BaseModel):
    full_name: str
    phone_number: str = Field(..., pattern=r"^\d{10}$") # Assuming 10 digits
    pin: str = Field(..., pattern=r"^\d{4}$") # 4-digit pin
    profile_photo_url: str
    latitude: float
    longitude: float

# Schema for Worker Login
class WorkerLoginRequest(BaseModel):
    phone_number: str
    pin: str

# Schema for Worker Profile (Response)
class WorkerResponse(BaseModel):
    id: str
    full_name: str
    phone_number: str
    profile_photo_url: str
    location: dict
    created_at: datetime

# Schema for Nearby Worker Search Result
class NearbyWorkerResult(BaseModel):
    full_name: str
    profile_photo_url: str
    phone_number: str
    distance: float # Distance in km (calculated by MongoDB)
