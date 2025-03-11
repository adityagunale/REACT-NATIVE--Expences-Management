import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get the local IP address for development
const getBaseUrl = () => {
  // For Android emulator, use 10.0.2.2 to access localhost
  // For iOS simulator, use localhost
  // For physical devices, use your computer's local IP address
  let baseUrl = 'http://localhost:5000';
  
  if (Constants.expoConfig?.extra?.isProduction) {
    // Use production URL when deployed
    baseUrl = 'https://your-production-api.com';
  } else if (Platform.OS === 'android') {
    baseUrl = 'http://10.0.2.2:5000';
  }
  
  return baseUrl;
};

// Create an axios instance
export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 (Unauthorized) and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear the token from storage
      await AsyncStorage.removeItem('token');
      
      // You could redirect to login screen here if needed
      // For now, we'll just reject the promise
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
); 