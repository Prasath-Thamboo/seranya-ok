import axios from 'axios';
import {
  RegisterUserModel,
  LoginUserModel,
  ResetPasswordModel,
  AuthResponse,
} from '../models/AuthModels';
import { getToken } from '../localStorage/auth';
import * as Auth from '../localStorage/auth';

// Set the correct base URL for API requests
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

// Define the correct API endpoint for login based on environment
const LOGIN_ENDPOINT = `${BASE_URL}/auth/login`;

// Define the correct API endpoint for reset password based on environment
const RESET_PASSWORD_ENDPOINT = `${BASE_URL}/auth/reset-password`;

// Function to register a new user
export const registerUser = async (
  data: RegisterUserModel
): Promise<AuthResponse> => {
  const formData = new FormData();

  formData.append('email', data.email);
  formData.append('password', data.password);
  if (data.name) formData.append('name', data.name);
  if (data.lastName) formData.append('lastName', data.lastName);
  if (data.address) formData.append('address', data.address);
  if (data.phone) formData.append('phone', data.phone);
  if (data.status) formData.append('status', data.status);
  formData.append('pseudo', data.pseudo);
  if (data.role) formData.append('role', data.role);
  if (data.profileImage) formData.append('profileImage', data.profileImage as File);

  const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/register`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};


export interface LoginResponse {
    message: string;
    token: {
      access_token: string;
    };
  }
  
  export interface LoginUserDto {
    email: string;
    password: string;
  }
  

  export const loginUser = async (data: { email: string; password: string }) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, data);
  
    if (response.data && response.data.token) {
      // Stocker le token JWT dans le localStorage
      localStorage.setItem('access_token', response.data.token);
      return response.data;
    }
  
    throw new Error('Login failed: Invalid response from server');
  };
  
  
  export async function logoutUser(): Promise<void> {
    const token = localStorage.getItem('access_token');
    if (token) {
      await axios.post(`${BASE_URL}/auth/logout`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Supprimer le token du localStorage lors de la déconnexion
      localStorage.removeItem('access_token');
    }
  }
  
  export function getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

// Function to generate a password reset token
export const generateResetToken = async (email: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/generate-reset-token`, { email }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

// Function to reset a user's password
export const resetPassword = async (data: ResetPasswordModel): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/reset-password`, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

// Function to delete a user account
export const deleteUserAccount = async (email: string, token: string): Promise<AuthResponse> => {
  const response = await axios.delete<AuthResponse>(`${BASE_URL}/auth/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: { email },
  });

  return response.data;
};

// Function to fetch the currently logged-in user's data
export const fetchCurrentUser = async (): Promise<RegisterUserModel> => {
  const token = getToken(); // Retrieve the token from local storage

  console.log("Token from local storage (before request):", token);

  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await axios.get<RegisterUserModel>(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Correctly format the Authorization header
      },
    });

    const user = response.data;
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

