import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

export const loginUser = async (phoneNumber, password) => {
  const res = await axios.post(`${API_URL}/otp`, { phoneNumber, password });
  return res.data;
};

export const signInWithOtp = async (otpId, otp) => {
  const res = await axios.post(`${API_URL}/signinwithotp`, { otpId, otp });
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
export const checkPhoneAndSendCode = async (phoneNumber, type) => {
  const result = await axios.post(`${API_URL}/otp/otpsend`, {
    phoneNumber,
    type,
  });
  return result.data;
};
export const verifyOtp = async (otpId, otp) => {
  const result = await axios.post(`${API_URL}/verifyOtp`, {
    otpId,
    otp,
  });
  return result;
};
export const updatePassword = async (phoneNumber, newPassword) => {
  const result = await axios.put(`${API_URL}/resetpassword`, {
    phoneNumber,
    newPassword,
  });
  return result.data;
};
