const API_URL = 'https://ocenka-bakalenko.ru/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Запросы с авторизацией (JSON)
export const fetchWithAuth = async (url, options = {}) => {
    try {
        const response = await fetch(`${API_URL}${url}`, {
            ...options,
            headers: getHeaders()
        });
        
        if (response.status === 401) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('cabinet_user');
            window.location.href = '/';
            throw new Error('Сессия истекла. Войдите заново.');
        }
        
        return response;
    } catch (err) {
        console.error('fetchWithAuth error:', err);
        throw err;
    }
};

// Запросы без авторизации (публичные)
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

// ЗАГРУЗКА ФАЙЛОВ - НЕЛЬЗЯ указывать Content-Type вручную!
export const fetchFormData = async (url, formData) => {
    try {
        const token = localStorage.getItem('token');
        
        // ВАЖНО: НЕ указываем Content-Type, браузер сам добавит multipart/form-data с правильной границей
        const response = await fetch(`${API_URL}${url}`, {
            method: 'POST',
            body: formData,
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
                // НЕ ДОБАВЛЯЕМ 'Content-Type'!
            }
        });
        
        if (response.status === 401) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('cabinet_user');
            window.location.href = '/';
            throw new Error('Сессия истекла. Войдите заново.');
        }
        
        return response;
    } catch (err) {
        console.error('fetchFormData error:', err);
        throw err;
    }
};