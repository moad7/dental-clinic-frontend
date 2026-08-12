import axios from 'axios';
import { auth } from '../utils/constants';
const API_URL = 'http://localhost:3000/api/treatment';

export const fetchTreatmentSessions = async (treatmentId, token) => {
  const res = await axios.get(
    `${API_URL}/${treatmentId}/sessions`,
    auth(token),
  );

  return res.data;
};

export const createTreatmentSession = async (treatmentId, payload, token) => {
  const res = await axios.post(
    `${API_URL}/${treatmentId}/sessions`,
    payload,
    auth(token),
  );

  return res.data;
};
export const deleteTreatmentSession = async (sessionId, token) => {
  const res = await axios.delete(
    `${API_URL}/sessions/${sessionId}`,
    auth(token),
  );

  return res.data;
};
