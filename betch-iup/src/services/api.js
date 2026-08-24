// API Service Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const jsonHeaders = { 'Content-Type': 'application/json' };

export const api = {
    // --- Questions API ---
    async getQuestions(filters = {}) {
        const query = new URLSearchParams(
            Object.entries(filters).filter(([_, v]) => v != null)
        ).toString();
        const res = await fetch(`${API_URL}/questions?${query}`, {
            headers: jsonHeaders
        });
        return res.json();
    },

    // --- Interview Flow API ---
    async startInterview(company, role, difficulty = 'Medium') {
        const res = await fetch(`${API_URL}/interviews/start`, {
            method: 'POST',
            headers: jsonHeaders,
            body: JSON.stringify({ company, role, difficulty })
        });
        return res.json();
    },

    async submitAnswer(sessionId, questionId, answerText) {
        const res = await fetch(`${API_URL}/interviews/${sessionId}/submit`, {
            method: 'POST',
            headers: jsonHeaders,
            body: JSON.stringify({ questionId, answerText })
        });
        return res.json();
    },

    async getSessionResults(sessionId) {
        const res = await fetch(`${API_URL}/interviews/${sessionId}/results`, {
            headers: jsonHeaders
        });
        return res.json();
    }
};
