import axios from 'axios';
import { auth } from '../utils/constants';
const API_URL = 'http://localhost:3000/api/services';

export const createServiceGroup = async (title, token) => {
  const res = await axios.post(`${API_URL}/groups`, { title }, auth(token));
  return res.data;
};

export const fetchServices = async (token) => {
  const res = await axios.get(`${API_URL}`, auth(token));
  return res.data;
};

export const addItemToServiseGroup = async (groupId, payload, token) => {
  console.log(payload);

  const res = await axios.post(
    `${API_URL}/${groupId}/items`,
    payload,
    auth(token),
  );
  return res.data;
};
