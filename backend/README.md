# KaamSetu Backend - FastAPI & MongoDB

This is the backend for the KaamSetu platform, helping migrant workers learn and connect with jobs.

## 📁 Project Structure
- `app/main.py`: Entry point and route initialization.
- `app/database.py`: MongoDB connection and geospatial index setup.
- `app/routes/auth_routes.py`: API Endpoints for worker signup, login, and search.
- `app/services/worker_service.py`: Business logic and MongoDB aggregation.
- `app/schemas/worker_schema.py`: Pydantic request/response validation.

## 🚀 Getting Started
1. **Setup Environment**:
   Ensure MongoDB is running locally or provide a `MONGO_URL` in `.env`.
   ```bash
   cp .env.example .env (optional)
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Server**:
   ```bash
   uvicorn app.main:app --reload
   ```

## 📡 API Endpoints
- `POST /api/workers/signup`: Create a new worker profile.
- `POST /api/workers/login`: Login with phone and 4-digit PIN.
- `GET /api/workers/nearby`: Search for workers within a 5km radius (or customize).
