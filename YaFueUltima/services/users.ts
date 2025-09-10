import axios from 'axios';
import { BASE_URL } from './services';

const API_URL = `${BASE_URL}/users`; // Cambia el puerto si es necesario

export async function getUserById(id: string) {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

interface CreateUserData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image: string | null;
  balance: number;
}

interface AuthResponse {
  email: string;
  password: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string | null;
    balance: number;
    createdAt: string;
    updatedAt: string;
  };
}

export async function createUser(user: CreateUserData): Promise<AuthResponse> {
  const response = await axios.post(API_URL, user);
  return response.data;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  console.log('Login user:', email, password);
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
}

export async function loginUserWithGoogle(email: string): Promise<AuthResponse> {
  const response = await axios.post(`${API_URL}/login/google`, { email });
  return response.data;
}

export async function updateUser(id: string, data: {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  balance: number;
}) {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
}


