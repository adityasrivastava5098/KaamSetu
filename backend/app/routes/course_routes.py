from fastapi import APIRouter
from typing import List
from app.schemas.course_schema import (
    CourseListItem,
    CourseDetail,
    CourseCompleteRequest,
    CourseCompleteResponse,
    CourseProgressRequest,
    CourseProgressResponse,
)
from app.services.course_service import CourseService

router = APIRouter(prefix="/api/courses", tags=["Courses"])


# ─── GET /api/courses ─────────────────────────────────────────────────────────
# Returns all courses (summary only, no video links)

@router.get("/", response_model=List[CourseListItem])
async def list_courses():
    """Return a list of all available courses (without video links)."""
    return CourseService.get_all_courses()


# ─── GET /api/courses/{cid} ───────────────────────────────────────────────────
# Returns full course details including video links

@router.get("/{cid}", response_model=CourseDetail)
async def get_course(cid: str):
    """Return full details of a specific course by its ID, including video links."""
    return CourseService.get_course_by_id(cid)


# ─── POST /api/courses/complete ───────────────────────────────────────────────
# Marks a course as completed and adds the skill badge to the worker profile

@router.post("/complete", response_model=CourseCompleteResponse)
async def complete_course(data: CourseCompleteRequest):
    """
    Mark a course as completed for a worker.
    Adds the course to completed_courses and the skill badge to the worker profile.
    Duplicates are automatically prevented.
    """
    return await CourseService.complete_course(data.worker_id, data.course_id)


# ─── POST /api/courses/progress ───────────────────────────────────────────────
# Updates the worker's progress in a specific course (which module they've watched)

@router.post("/progress", response_model=CourseProgressResponse)
async def update_progress(data: CourseProgressRequest):
    """
    Update a worker's progress in a course.
    Tracks how many modules the worker has completed (e.g., watched 2 out of 3 videos).
    """
    return await CourseService.update_progress(data.worker_id, data.course_id, data.module_index)


# ─── GET /api/courses/worker/{worker_id} ──────────────────────────────────────
# Returns the full progress, badges, and completed courses for a given worker

@router.get("/worker/{worker_id}")
async def get_worker_progress(worker_id: str):
    """Return the worker's badges, completed courses, and module-level progress."""
    return await CourseService.get_worker_progress(worker_id)
