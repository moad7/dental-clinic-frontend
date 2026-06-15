import axios from 'axios';
import { auth } from '../utils/constants';
const API_URL = 'http://localhost:3000/api/secretary';

export const createDoctorBySecretary = async (formData, token) => {
  const res = await axios.post(
    `${API_URL}/createDoctorBySecretary`,
    { formData },
    auth(token),
  );
  return res.data;
};
