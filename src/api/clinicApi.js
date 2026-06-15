import axios from 'axios';
import { auth } from '../utils/constants';
const API_URL = 'http://localhost:3000/api/clinic';

export const fetchAllClincis = async (token) => {
  const res = await axios.get(`${API_URL}/getAllClinics`, auth(token));
  return res.data;
};
