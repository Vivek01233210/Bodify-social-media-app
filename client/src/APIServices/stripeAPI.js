import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BONDIFY_API_URL;
const BASE_URL = `${BASE_API_URL}/stripe`;

export const paymentIntentAPI = async (planId) => {
    const response = await axios.post(`${BASE_URL}/checkout`,
        {
            subscriptionPlanId: planId
        },
        {
            withCredentials: true,
        });
    return response.data;
};

//!payment verification
export const paymentVerificationAPI = async (paymentId) => {
    const response = await axios.get(`${BASE_URL}/verify/${paymentId}`, {
        withCredentials: true,
    });
    return response.data;
};

//!Free pln
export const freePlanAPI = async () => {
    const response = await axios.get(`${BASE_URL}/free-plan`, {
        withCredentials: true,
    });
    return response.data;
};