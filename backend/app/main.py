from fastapi import FastAPI
from app.routes import auth_routes
from app.database import init_db
import uvicorn
import os

app = FastAPI(
    title="KaamSetu Worker Backend SDK",
    description="Helping migrant workers learn skills and connect with job providers.",
    version="1.0.0"
)

# Root route
@app.get("/")
async def root():
    return {"message": "Welcome to the KaamSetu Worker API. Learn Skills and Connect!"}

# Include routes
app.include_router(auth_routes.router)

@app.on_event("startup")
async def startup_event():
    """ Initialize DB and create geospatial indexes at startup. """
    await init_db()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
