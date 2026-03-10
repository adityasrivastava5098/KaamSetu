import json
import os
from bson import ObjectId
from fastapi import HTTPException
from app.database import db

# ─── Load courses from JSON file ──────────────────────────────────────────────
COURSES_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "courses.json")

def load_courses() -> list:
    """Load all course definitions from the courses.json file."""
    with open(COURSES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

# Pre-load courses into memory for fast access
COURSES = load_courses()

# Build a lookup dict for O(1) access by course ID
COURSES_BY_ID = {course["cid"]: course for course in COURSES}

# Workers collection
workers_collection = db["workers"]


class CourseService:

    # ─── GET ALL COURSES (summary only, no video links) ───────────────────────

    @staticmethod
    def get_all_courses() -> list:
        """Return all courses without video links (for listing page)."""
        return [
            {
                "cid": c["cid"],
                "cname": c["cname"],
                "skillname": c["skillname"],
                "icon": c["icon"],
            }
            for c in COURSES
        ]

    # ─── GET SINGLE COURSE BY ID (full details with video links) ──────────────

    @staticmethod
    def get_course_by_id(cid: str) -> dict:
        """Return full course details including video links."""
        course = COURSES_BY_ID.get(cid)
        if not course:
            raise HTTPException(status_code=404, detail=f"Course '{cid}' not found.")
        return course

    # ─── COMPLETE A COURSE ────────────────────────────────────────────────────

    @staticmethod
    async def complete_course(worker_id: str, course_id: str) -> dict:
        """
        Mark a course as completed for a worker:
        1. Validate the worker and course exist
        2. Add course_id to completed_courses (avoid duplicates)
        3. Add the course's skillname as a badge (avoid duplicates)
        4. Return updated worker profile info
        """
        # 1. Validate course exists
        course = COURSES_BY_ID.get(course_id)
        if not course:
            raise HTTPException(status_code=404, detail=f"Course '{course_id}' not found.")

        # 2. Validate worker exists
        try:
            worker = await workers_collection.find_one({"_id": ObjectId(worker_id)})
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid worker ID format.")

        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found.")

        # 3. Get the skill badge name from the course
        badge_name = course["skillname"]

        # 4. Use $addToSet to avoid duplicates in both arrays
        await workers_collection.update_one(
            {"_id": ObjectId(worker_id)},
            {
                "$addToSet": {
                    "completed_courses": course_id,
                    "badges": badge_name,
                }
            }
        )

        # 5. Fetch the updated worker document
        updated_worker = await workers_collection.find_one({"_id": ObjectId(worker_id)})

        return {
            "message": f"Course '{course['cname']}' completed successfully!",
            "badge_added": badge_name,
            "completed_courses": updated_worker.get("completed_courses", []),
            "badges": updated_worker.get("badges", []),
        }

    # ─── UPDATE COURSE PROGRESS ───────────────────────────────────────────────

    @staticmethod
    async def update_progress(worker_id: str, course_id: str, module_index: int) -> dict:
        """
        Update a worker's progress in a specific course.
        progress is stored as: { "c1": 2, "c2": 1 } meaning:
        - Completed 2 modules in course c1
        - Completed 1 module in course c2
        """
        # 1. Validate course exists
        course = COURSES_BY_ID.get(course_id)
        if not course:
            raise HTTPException(status_code=404, detail=f"Course '{course_id}' not found.")

        # 2. Validate worker exists
        try:
            worker = await workers_collection.find_one({"_id": ObjectId(worker_id)})
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid worker ID format.")

        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found.")

        # 3. Validate module_index is within range
        total_modules = len(course.get("videolinks", {}))
        if module_index < 1 or module_index > total_modules:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid module index. Course has {total_modules} modules (1-{total_modules})."
            )

        # 4. Get current progress and only update if new value is higher
        current_progress = worker.get("progress", {})
        current_module = current_progress.get(course_id, 0)

        if module_index > current_module:
            # Use dot notation to update nested progress field
            await workers_collection.update_one(
                {"_id": ObjectId(worker_id)},
                {"$set": {f"progress.{course_id}": module_index}}
            )

        return {
            "message": f"Progress updated for '{course['cname']}'",
            "course_id": course_id,
            "modules_completed": max(module_index, current_module),
        }

    # ─── GET WORKER PROGRESS ─────────────────────────────────────────────────

    @staticmethod
    async def get_worker_progress(worker_id: str) -> dict:
        """Return the full progress, badges, and completed courses for a worker."""
        try:
            worker = await workers_collection.find_one({"_id": ObjectId(worker_id)})
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid worker ID format.")

        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found.")

        return {
            "worker_id": worker_id,
            "badges": worker.get("badges", []),
            "completed_courses": worker.get("completed_courses", []),
            "progress": worker.get("progress", {}),
        }
