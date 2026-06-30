import axios from 'axios';
import { auth } from '../utils/constants';

const API_URL = 'http://localhost:3000/api/appointments';

export const createAppointments = async (payload, token) => {
  const res = await axios.post(
    `${API_URL}/createAppointment`,
    payload,
    auth(token),
  );
  return res.data;
};
