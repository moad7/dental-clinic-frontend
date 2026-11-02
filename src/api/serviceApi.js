import axios from 'axios';
import { auth } from '../utils/constants';
const API_URL = 'http://localhost:3000/api/services';
export const createServiceGroup = async (title, token) => {
  const res = await axios.post(`${API_URL}/groups`, { title }, auth(token));
  return res.data;
};
export const fetchServices = async (token, view) => {
  const res = await axios.get(API_URL, {
    ...auth(token),
    params: { view },
  });
  return res.data;
};
export const addItemToServiseGroup = async (groupId, formData, token) => {
  const res = await axios.post(
    `${API_URL}/${groupId}/items`,
    formData,
    auth(token),
  );
  return res.data;
};
export const updateServiceItem = async (groupId, itemId, formData, token) => {
  const res = await axios.put(
    `${API_URL}/${groupId}/items/${itemId}`,
    formData,
    auth(token),
  );
  return res.data;
};
export const deleteServiceItem = async (groupId, itemId, token) => {
  const res = await axios.delete(
    `${API_URL}/${groupId}/items/${itemId}`,
    auth(token),
  );
  return res.data;
};
export const fetchServiceArchivePreview = async (groupId, itemId, token) => {
  const res = await axios.get(
    `${API_URL}/${groupId}/items/${itemId}/archive-preview`,
    auth(token),
  );
  return res.data;
};
export const archiveServiceItem = async (groupId, itemId, token) => {
  const res = await axios.patch(
    `${API_URL}/${groupId}/items/${itemId}/archive`,
    {},
    auth(token),
  );
  return res.data;
};
