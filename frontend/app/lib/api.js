const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL 
  : 'http://localhost:5000';

export const api = {
  baseUrl: API_BASE_URL,
  applications: `${API_BASE_URL}/api/applications`,
  auth: `${API_BASE_URL}/api/auth/login`,
  admin: {
    applications: `${API_BASE_URL}/api/admin/applications`,
    stats: `${API_BASE_URL}/api/admin/stats`
  }
};