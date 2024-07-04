import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BONDIFY_API_URL;
const BASE_URL = `${BASE_API_URL}/category`;

export const addCategoryAPI = async (postData) => {
    // console.log(postData);
    const response = await axios.post(`${BASE_URL}/create`, postData, {
      withCredentials: true,
    });
    return response.data;
  };
  
  // Fetch all catgories
  export const getCategoriesAPI = async () => {
    const posts = await axios.get(BASE_URL);
    return posts.data;
  };