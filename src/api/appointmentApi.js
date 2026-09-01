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

export const fetchAllAppointments = async (token) => {
  const res = await axios.get(`${API_URL}`, auth(token));
  return res.data;
};

export const updateAppointmentById = async (
  updateData,
  appointmentId,
  token,
) => {
  const res = await axios.patch(
    `${API_URL}/updateAppointment/${appointmentId}`,
    updateData,
    auth(token),
  );
  return res.data;
};
export const confirmDateById = async (appointmentId, decision, token) => {
  const res = await axios.patch(
    `${API_URL}/decision/${appointmentId}`,
    { decision },
    auth(token),
  );
  return res.data;
};

export const fetchAppointmentDay = async (token) => {
  const res = await axios.get(`${API_URL}/today`, auth(token));
  return res.data;
};
