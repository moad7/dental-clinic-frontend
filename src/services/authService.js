import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const loginUser = async (phoneNumber, password) => {
  const res = await axios.post(`${API_URL}/login`, { phoneNumber, password });
  return res.data;
};
export const registerUser = async (name, phoneNumber, password) => {
  const res = await axios.post(`${API_URL}/register`, {
    name,
    phoneNumber,
    password,
  });
  return res.data;
};
