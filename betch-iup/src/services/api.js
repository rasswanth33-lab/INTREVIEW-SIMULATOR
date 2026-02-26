// API Service Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth headers
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

// Handle 401 globally — clear stale tokens and redirect to login
const handleResponse = async (res) => {
    const data = await res.json();
    if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login so user can re-authenticate
        window.location.href = '/login';
    }
    return data;
};

export const api = {
    // --- Auth API ---
    async login(email, password) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },

    async register(data) {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    // --- Questions API ---
    async getQuestions(filters = {}) {
        const query = new URLSearchParams(
            Object.entries(filters).filter(([_, v]) => v != null)
        ).toString();
        const res = await fetch(`${API_URL}/questions?${query}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(res);
    },

    // --- Interview Flow API ---
    async startInterview(company, role, difficulty = 'Medium') {
        const res = await fetch(`${API_URL}/interviews/start`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ company, role, difficulty })
        });
        return handleResponse(res);
    },

    async submitAnswer(sessionId, questionId, answerText) {
        const res = await fetch(`${API_URL}/interviews/${sessionId}/submit`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ questionId, answerText })
        });
        return handleResponse(res);
    },

    async getSessionResults(sessionId) {
        const res = await fetch(`${API_URL}/interviews/${sessionId}/results`, {
            headers: getAuthHeaders()
        });
        return handleResponse(res);
    }
};

