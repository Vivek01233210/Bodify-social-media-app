import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BONDIFY_API_URL;
const BASE_URL = `${BASE_API_URL}/comments`;

export const addCommentAPI = async (data) => {
    const response = await axios.post(`${BASE_URL}/create`, data, {
      withCredentials: true,
    });
    return response.data;
  };