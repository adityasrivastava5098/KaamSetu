from datetime import datetime
import os
from bson import ObjectId
from pymongo import GEOSPHERE
from app.database import db
from app.schemas.worker_schema import WorkerCreateRequest, WorkerLoginRequest
from fastapi import HTTPException

# Collection access
workers_collection = db["workers"]

class WorkerService:
    @staticmethod
    async def signup_worker(worker_data: WorkerCreateRequest):
        # 1. Check if the worker already exists with the same phone number
        existing_worker = await workers_collection.find_one({"phone_number": worker_data.phone_number})
        if existing_worker:
            raise HTTPException(status_code=400, detail="Worker with this phone number already exists.")

        # 2. Prepare the worker document
        # Represented as GeoJSON Point for MongoDB geospatial queries
        worker_doc = {
            "full_name": worker_data.full_name,
            "phone_number": worker_data.phone_number,
            "pin": worker_data.pin, # Only storing plain text for now, should be hashed in production
            "profile_photo_url": worker_data.profile_photo_url,
            "location": {
                "type": "Point",
                "coordinates": [worker_data.longitude, worker_data.latitude] # [lng, lat] for MongoDB
            },
            # Course system fields
            "badges": [],                # List of earned skill badge names
            "completed_courses": [],     # List of completed course IDs
            "progress": {},              # Module-level progress per course: {"c1": 2, "c2": 1}
            "created_at": datetime.utcnow()
        }

        # 3. Insert into the database
        result = await workers_collection.insert_one(worker_doc)
        return str(result.inserted_id)

    @staticmethod
    async def login_worker(credentials: WorkerLoginRequest):
        # 1. Find worker by phone number and pin
        worker = await workers_collection.find_one({
            "phone_number": credentials.phone_number,
            "pin": credentials.pin
        })

        if not worker:
            raise HTTPException(status_code=401, detail="Invalid phone number or PIN.")

        # 2. Prepare response profile (include course system fields)
        worker["id"] = str(worker["_id"])
        return worker

    @staticmethod
    async def get_nearby_workers(lat: float, lon: float, radius_km: float = 5.0):
        # 1. Use MongoDB $near query to find workers in radius
        # Radius in meters (convert from km)
        radius_meters = radius_km * 1000

        # Create geoNear aggregation pipeline or simple query
        # Using $geoNear is better to return the distance directly
        pipeline = [
            {
                "$geoNear": {
                    "near": {"type": "Point", "coordinates": [lon, lat]},
                    "distanceField": "distance", # distance in meters by default
                    "maxDistance": radius_meters,
                    "spherical": True
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "full_name": 1,
                    "profile_photo_url": 1,
                    "phone_number": 1,
                    "distance": {"$divide": ["$distance", 1000]} # convert meters to km for response
                }
            }
        ]

        cursor = workers_collection.aggregate(pipeline)
        nearby_workers = await cursor.to_list(length=None)
        return nearby_workers
