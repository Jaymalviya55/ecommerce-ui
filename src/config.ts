let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
if (API_URL && !API_URL.endsWith('/api')) {
    API_URL = API_URL.replace(/\/$/, '') + '/api';
}
export { API_URL };
