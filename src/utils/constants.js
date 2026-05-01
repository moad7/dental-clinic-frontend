export const auth = (token) => {
  return { headers: { Authorization: `Bearer ${token}` } };
};
