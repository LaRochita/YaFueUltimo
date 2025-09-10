import axios from 'axios';
import { BASE_URL } from './services';

const API_URL = `${BASE_URL}/expenses`;

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
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: Currency;
  pay_type: 'EQUAL_PARTS' | 'ASSIGN';
  paid: boolean;
  user: User;
  meeting: Meeting;
  createdAt: string;
  updatedAt: string;
}

interface UpdateExpenseData {
  description?: string;
  amount?: number;
  currency_id?: string;
  pay_type?: 'EQUAL_PARTS' | 'ASSIGN';
}

interface MarkAsPaidData {
  userId: string;
}

export async function getExpenseById(id: string): Promise<Expense> {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

export async function getExpensesByUserId(userId: string): Promise<Expense[]> {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
}

export async function getExpensesByMeetingId(meetingId: string): Promise<Expense[]> {
  const response = await axios.get(`${API_URL}/meeting/${meetingId}`);
  return response.data;
}

export async function updateExpense(id: string, data: UpdateExpenseData): Promise<Expense> {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
}

export async function deleteExpense(id: string): Promise<Expense> {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}

export async function markExpenseAsPaid(id: string, data: MarkAsPaidData): Promise<Expense> {
  const response = await axios.patch(`${API_URL}/${id}/pay`, data);
  return response.data;
}

// Additional utility functions that might be useful
export async function getUnpaidExpensesByUserId(userId: string): Promise<Expense[]> {
  const expenses = await getExpensesByUserId(userId);
  return expenses.filter(expense => !expense.paid);
}

export async function getPaidExpensesByUserId(userId: string): Promise<Expense[]> {
  const expenses = await getExpensesByUserId(userId);
  return expenses.filter(expense => expense.paid);
}

export async function getTotalAmountByUserId(userId: string): Promise<number> {
  const expenses = await getExpensesByUserId(userId);
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export async function getUnpaidTotalByUserId(userId: string): Promise<number> {
  const unpaidExpenses = await getUnpaidExpensesByUserId(userId);
  return unpaidExpenses.reduce((total, expense) => total + expense.amount, 0);
}
