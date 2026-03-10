const API_BASE = 'http://localhost:8000/api';
const BACKEND_BASE = 'http://localhost:8000';

export const api = {
    async signup(data) {
        const res = await fetch(`${API_BASE}/workers/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) {
            throw new Error(json.detail || 'Signup failed');
        }
        return json;
    },

    async login(phone_number, pin) {
        const res = await fetch(`${API_BASE}/workers/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number, pin }),
        });
        const json = await res.json();
        if (!res.ok) {
            throw new Error(json.detail || 'Login failed');
        }
        return json;
    },

    async uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_BASE}/upload/image`, {
            method: 'POST',
            body: formData,
        });
        const json = await res.json();
        if (!res.ok) {
            throw new Error(json.detail || 'Image upload failed');
        }
        // Return full URL for the uploaded image
        return { ...json, fullUrl: `${BACKEND_BASE}${json.url}` };
    },
};
