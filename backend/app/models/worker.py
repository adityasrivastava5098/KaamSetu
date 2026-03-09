# Models for MongoDB representation

from datetime import datetime
from pydantic import BaseModel, Field

# This model is primarily for internal documentation of the worker document in MongoDB
class WorkerModel(BaseModel):
    full_name: str
    phone_number: str
    pin: str
    profile_photo_url: str
    location: dict # GeoJSONPoint coordinates stored as [longitude, latitude]
    created_at: datetime
