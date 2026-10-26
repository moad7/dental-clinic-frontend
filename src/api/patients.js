import axios from 'axios';
import { auth } from '../utils/constants';
const API_URL = 'http://localhost:3000/api/patients';
export const fetchAllPatients = async (token) => {
  const res = await axios.get(`${API_URL}/getAllPatients`, auth(token));
  console.log('fetchAllPatients response:', res.data);
  return res.data;
};
export const fetchPatientFullProfile = async (patientId, token) => {
  const res = await axios.get(
    `${API_URL}/${patientId}/full-details`,
    auth(token),
  );
  return res.data;
};
