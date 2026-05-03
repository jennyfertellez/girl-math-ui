import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debts
export const getDebts = () => api.get('/debts');
export const addDebt = (debt) => api.post('/debts', debt);
export const updateDebt = (id, debt) => api.put(`/debts/${id}`, debt);
export const deleteDebt = (id) => api.delete(`/debts/${id}`);

// Savings Goals
export const getSavingsGoals = () => api.get('/savings-goals');
export const addSavingsGoal = (goal) => api.post('/savings-goals', goal);
export const updateSavingsGoal = (id, goal) => api.put(`/savings-goals/${id}`, goal);
export const deleteSavingsGoal = (id) => api.delete(`/savings-goals/${id}`);

// Snowball
export const calculateSnowball = (extraPayment = 0) =>
  api.get(`/snowball/calculate?extraPayment=${extraPayment}`);

// Dashboard
export const getDashboard = () => api.get('/dashboard');

// Savings Projection
export const getSavingsProjections = () => api.get('/savings-projection');

export const markDebtPaidOff = (id) => api.put(`/debts/${id}`, { paidOff: true });