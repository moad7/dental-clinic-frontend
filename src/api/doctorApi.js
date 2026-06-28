import axios from 'axios';
import { auth } from '../utils/constants';
const API_URL = 'http://localhost:3000/api/doctor';

export const fetchAllDoctors = async (token) => {
  const res = await axios.get(`${API_URL}/getAllDoctors`, auth(token));
  return res.data;
};
export const fetchDoctorsByService = async (token, payload) => {
  const res = await axios.post(
    `${API_URL}/getDoctorsByService`,
    { payload },
    auth(token),
  );

  return res.data;
};
export const fetchDoctorAvailableSlots = async (payload, token) => {
  const res = await axios.post(
    `${API_URL}/doctorAvailableSlots`,
    { payload },
    auth(token),
  );

  return res.data;
};
