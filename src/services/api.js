const API_BASE = 'http://localhost:8000/api';
const BACKEND_BASE = 'http://localhost:8000';

export const api = {
    // ─── AUTH ────────────────────────────────────────────────────────────────────

    async signup(data) {
        const res = await fetch(`${API_BASE}/workers/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || 'Signup failed');
        return json;
    },

    async login(phone_number, pin) {
        const res = await fetch(`${API_BASE}/workers/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number, pin }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || 'Login failed');
        return json;
    },

    // ─── IMAGE UPLOAD ───────────────────────────────────────────────────────────

    async uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_BASE}/upload/image`, {
            method: 'POST',
            body: formData,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || 'Image upload failed');
        return { ...json, fullUrl: `${BACKEND_BASE}${json.url}` };
    },

    // ─── COURSES ────────────────────────────────────────────────────────────────

    async getCourses() {
        const res = await fetch(`${API_BASE}/courses/`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || 'Failed to fetch courses');
        return json;
    },

    async getCourseDetail(cid) {
        const res = await fetch(`${API_BASE}/courses/${cid}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || 'Failed to fetch course');
        return json;
    },

    async completeCourse(workerId, courseId) {
        const res = await fetch(`${API_BASE}/courses/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ worker_id: workerId, course_id: courseId }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || 'Failed to complete course');
        return json;
    },

    async updateProgress(workerId, courseId, moduleIndex) {
        const res = await fetch(`${API_BASE}/courses/progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ worker_id: workerId, course_id: courseId, module_index: moduleIndex }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || 'Failed to update progress');
        return json;
    },

    async getWorkerProgress(workerId) {
        const res = await fetch(`${API_BASE}/courses/worker/${workerId}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.detail || 'Failed to fetch progress');
        return json;
    },
};
