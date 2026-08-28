export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') || 'http://localhost:5000';

export const resolveApiUrl = (url: string): string => {
  if (url.startsWith('http://localhost:5000')) {
    return url.replace('http://localhost:5000', API_BASE_URL);
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const fullUrl = resolveApiUrl(url);
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  const response = await fetch(fullUrl, { ...options, headers });
  
  if (response.status === 401) {
    // Session expired or invalid
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return response;
};

