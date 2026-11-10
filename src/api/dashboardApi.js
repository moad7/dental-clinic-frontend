import axios from 'axios';
import { auth } from '../utils/constants';
const API_URL = 'http://localhost:3000/api/dashboard';
export const fetchDashboardStats = async (view, token) => {
  const response = await axios.get(`${API_URL}/stats`, {
    ...auth(token),
    params: { view },
  });
  return response.data;
};
