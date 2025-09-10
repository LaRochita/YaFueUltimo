import axios from 'axios';
import { BASE_URL } from './services';

const API_URL = `${BASE_URL}/groups`;

interface Group {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  users: User[];
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

interface CreateGroupData {
  name: string;
  description: string;
  image: string;
  userId: string;
}

interface UpdateGroupData {
  name: string;
  description: string;
  image: string;
}

export async function createGroup(data: CreateGroupData): Promise<Group> {
  const response = await axios.post(API_URL, data);
  return response.data;
}

export async function getGroupsByUserId(userId: string): Promise<Group[]> {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
}

export async function getGroupById(id: string): Promise<Group> {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

export async function inviteUserToGroup(groupId: string, userId: string): Promise<Group> {
  const response = await axios.patch(`${API_URL}/invite`, { groupId, userId });
  return response.data;
}

export async function removeUserFromGroup(groupId: string, userId: string): Promise<Group> {
  const response = await axios.patch(`${API_URL}/remove`, { groupId, userId });
  return response.data;
}

export async function deleteGroup(id: string): Promise<Group> {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}

export async function updateGroup(id: string, data: UpdateGroupData): Promise<Group> {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
}
