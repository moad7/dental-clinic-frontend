import axios from 'axios';
import { auth } from '../utils/constants';
const API_URL = 'http://localhost:3000/api/services';

export const createServiceGroup = async (title, token) => {
  const res = await axios.post(`${API_URL}/groups`, { title }, auth(token));
  return res.data;
};
