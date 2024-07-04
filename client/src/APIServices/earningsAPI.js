import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BONDIFY_API_URL;
const BASE_URL = `${BASE_API_URL}/earnings`;

// Fetch all earnings
export const getAllEarningsAPI = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// Fetch my earnings
export const getMyEarningsAPI = async () => {
  const response = await axios.get(`${BASE_URL}/my-earnings`, {
    withCredentials: true,
  });
  return response.data;
};