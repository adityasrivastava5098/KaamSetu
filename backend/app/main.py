from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import auth_routes, upload_routes, course_routes
from app.database import init_db
import uvicorn
import os

app = FastAPI(
    title="KaamSetu Worker Backend SDK",
    description="Helping migrant workers learn skills and connect with job providers.",
    version="1.0.0"
)

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root route
@app.get("/")
async def root():
    return {"message": "Welcome to the KaamSetu Worker API. Learn Skills and Connect!"}

# Include API routes FIRST (before static mount to avoid route conflicts)
app.include_router(auth_routes.router)
app.include_router(upload_routes.router)
app.include_router(course_routes.router)

# Serve uploaded images as static files AFTER API routes
IMAGES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "images")
os.makedirs(IMAGES_DIR, exist_ok=True)
app.mount("/api/upload/images", StaticFiles(directory=IMAGES_DIR), name="uploaded_images")

@app.on_event("startup")
async def startup_event():
    """ Initialize DB and create geospatial indexes at startup. """
    await init_db()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
