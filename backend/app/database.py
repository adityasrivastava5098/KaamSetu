import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "kaam_setu_db")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

async def init_db():
    """ Initialize MongoDB indexes. """
    collection = db.workers
    # Create 2dsphere index for location field
    await collection.create_index([("location", "2dsphere")])
    print("MongoDB successfully initialized with geospatial index.")

def get_collection(name: str):
    return db[name]
