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

export const updateDoctorBySecretary = async (doctorId, formData, token) => {
  const res = await axios.put(
    `${API_URL}/updateDoctorBySecretary/${doctorId}`,
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
export const createPatientsBySecretary = async (payload, token) => {
  const res = await axios.post(
    `${API_URL}/createPatientsBySecretary`,
    { payload },
    auth(token),
  );
  return res.data;
};
export const fetchPatientFullDetailsBySecretary = async (patientId, token) => {
  const res = await axios.get(
    `${API_URL}/patients/${patientId}/full-details`,
    auth(token),
  );
  return res.data;
};
