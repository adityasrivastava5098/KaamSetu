from pydantic import BaseModel
from typing import Dict, List, Optional


# --- Request Schemas ---

class CourseCompleteRequest(BaseModel):
    """Request body when a worker completes a course."""
    worker_id: str
    course_id: str


class CourseProgressRequest(BaseModel):
    """Request body to update a worker's progress in a course."""
    worker_id: str
    course_id: str
    module_index: int  # Which module the worker just completed (1, 2, 3...)


# --- Response Schemas ---

class CourseListItem(BaseModel):
    """Schema for course list items (no video links exposed)."""
    cid: str
    cname: str
    skillname: str
    icon: str


class CourseDetail(BaseModel):
    """Full course details including video links."""
    cid: str
    cname: str
    skillname: str
    icon: str
    videolinks: Dict[str, str]  # {"module1": "url", "module2": "url", ...}


class CourseCompleteResponse(BaseModel):
    """Response after completing a course."""
    message: str
    badge_added: str
    completed_courses: List[str]
    badges: List[str]


class CourseProgressResponse(BaseModel):
    """Response after updating progress."""
    message: str
    course_id: str
    modules_completed: int
