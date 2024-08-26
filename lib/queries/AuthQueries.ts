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

    // Define the API endpoint for login (adjust the URL as needed)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
// Define the correct API endpoint for login
const LOGIN_ENDPOINT = 'http://localhost:5000/auth/login';

// Function to register a new user
export const registerUser = async (
  data: RegisterUserModel,
  token: string,
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
      Authorization: `Bearer ${token}`,
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
  
  export async function loginUser(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';
    
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginUserDto),
      });
  
      if (!response.ok) {
        throw new Error('Failed to login. Please check your credentials and try again.');
      }
  
      const data: LoginResponse = await response.json();
  
      // Log the token for debugging purposes
      console.log('Login successful:', data.token.access_token);
  
      // Return the data so it can be used in the calling function
      return data;
  
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }
  
  
  
  // Function to retrieve the access token from localStorage or cookies
  export function getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
  

// Function to log out a user
export const logoutUser = async (token: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/logout`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

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

