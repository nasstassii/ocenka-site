const API_URL = 'http://localhost:5000/api';

export const fetchPublic = async (url, options = {}) => {
    try {
        const response = await fetch(`${API_URL}${url}`, {
            ...options,
            headers: { 'Content-Type': 'application/json' }
        });
        return response;
    } catch (err) {
        console.error('fetchPublic error:', err);
        throw err;
    }
};

export const fetchFormData = async (url, formData) => {
    try {
        const response = await fetch(`${API_URL}${url}`, {
            method: 'POST',
            body: formData
        });
        return response;
    } catch (err) {
        console.error('fetchFormData error:', err);
        throw err;
    }
};