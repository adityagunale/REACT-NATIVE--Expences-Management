// API Configuration
export const API_URL = 'http://192.168.43.42:5000'; // Use your computer's IP address

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/api/users/login`,
    REGISTER: `${API_URL}/api/users/register`,
    FORGOT_PASSWORD: `${API_URL}/api/users/forgot-password`,
    RESET_PASSWORD: `${API_URL}/api/users/reset-password`,
  },
  EMAIL: {
    SEND_REPORT: `${API_URL}/api/email/send-report`,
  },
}; 