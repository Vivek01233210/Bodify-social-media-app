import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BONDIFY_API_URL;
const BASE_URL = `${BASE_API_URL}/plan`;

export const createPlanAPI = async (planData) => {
  const response = await axios.post(`${BASE_URL}/create`, planData, {
    withCredentials: true,
  });
  return response.data;
};

// Fetch all plans
export const getPlansAPI = async () => {
  const plans = await axios.get(BASE_URL);
  return plans.data;
};

// fetch a plan
export const getPlanAPI = async (planId) => {
  const plan = await axios.get(`${BASE_URL}/${planId}`);
  return plan.data;
}; 