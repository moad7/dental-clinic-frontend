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

export const fetchAllPatientBySecretary = async (token) => {
  const res = await axios.get(
    `${API_URL}/getAllPatientBySecretary`,
    auth(token),
  );
  return res.data;
};

export const fetchAvailableDoctors = async (token, payload) => {
  const res = await axios.post(
    `${API_URL}/availableDoctors`,
    { payload },
    auth(token),
  );

  return res.data;
};
