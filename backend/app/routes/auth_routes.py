from fastapi import APIRouter, HTTPException, Depends, Query
from app.schemas.worker_schema import WorkerCreateRequest, WorkerLoginRequest, WorkerResponse, NearbyWorkerResult
from app.services.worker_service import WorkerService
from typing import List

router = APIRouter(prefix="/api/workers", tags=["Workers"])

@router.post("/signup", response_model=dict)
async def signup(worker: WorkerCreateRequest):
    """ Post worker data and coordinates to MongoDB. Return the result ID. """
    worker_id = await WorkerService.signup_worker(worker)
    return {"message": "Worker successfully registered", "worker_id": worker_id}

@router.post("/login")
async def login(credentials: WorkerLoginRequest):
    """ Authenticate worker using phone number and 4-digit PIN. """
    worker_profile = await WorkerService.login_worker(credentials)

    # Convert mongo object into response dict
    return {
        "id": str(worker_profile["_id"]),
        "full_name": worker_profile["full_name"],
        "phone_number": worker_profile["phone_number"],
        "profile_photo_url": worker_profile["profile_photo_url"],
        "location": worker_profile["location"],
        "badges": worker_profile.get("badges", []),
        "completed_courses": worker_profile.get("completed_courses", []),
        "progress": worker_profile.get("progress", {}),
        "created_at": worker_profile["created_at"]
    }

@router.get("/nearby", response_model=List[NearbyWorkerResult])
async def search_nearby(
    latitude: float = Query(..., description="The latitude of the job provider location"),
    longitude: float = Query(..., description="The longitude of the job provider location"),
    radius: float = Query(5.0, description="The radius in km to search within (default 5km)")
):
    """ Return workers located near the provided longitude and latitude using geospatial queries. """
    nearby_workers = await WorkerService.get_nearby_workers(latitude, longitude, radius)
    return nearby_workers
