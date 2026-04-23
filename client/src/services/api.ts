export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    // Session expired or invalid
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return response;
};
