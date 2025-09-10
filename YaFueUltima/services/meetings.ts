import axios from 'axios';
import { BASE_URL } from './services';

const API_URL = `${BASE_URL}/meetings`;

interface Currency {
  id: string;
  name: string;
  symbol: string;
}

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  balance: number;
}

interface UserWithAmount extends User {
  amount?: number;
}

interface Meeting {
  id: string;
  name: string;
  description: string;
  date: string;
  place: string;
  pay_type: 'EQUAL' | 'ASSIGN';
  amount: number;
  currency: Currency;
  expenseDescription: string;
  users: User[];
  createdAt: string;
  updatedAt: string;
}

interface CreateMeetingData {
  name: string;
  description: string;
  date: string;
  place: string;
  pay_type: 'EQUAL' | 'ASSIGN';
  amount: number;
  currency_id: string;
  users: UserWithAmount[];
  expenseDescription: string;
}

interface UpdateMeetingData {
  name: string;
  description: string;
  date: string;
  place: string;
}

export async function createMeeting(data: CreateMeetingData): Promise<Meeting> {
  console.log(data);
  const response = await axios.post(API_URL, data);
  return response.data;
}

export async function updateMeeting(id: string, data: UpdateMeetingData): Promise<Meeting> {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
}

export async function deleteMeeting(id: string): Promise<Meeting> {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}

export async function getMeetingById(id: string): Promise<Meeting> {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

// Additional utility functions that might be useful
export async function getMeetingsByUserId(userId: string): Promise<Meeting[]> {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
}

export async function getMeetingsByGroupId(groupId: string): Promise<Meeting[]> {
  const response = await axios.get(`${API_URL}/group/${groupId}`);
  return response.data;
}
