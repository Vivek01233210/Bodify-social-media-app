import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BONDIFY_API_URL;
const BASE_URL = `${BASE_API_URL}/notifications`;

// fetch all notifications
export const fetchNotificationsAPI = async () => {
        const response = await axios.get(`${BASE_URL}`);
        return response.data;
};

// read notification
export const readNotificationAPI = async (notificationId) => {
        const response = await axios.put(`${BASE_URL}/${notificationId}`, {});
        return response.data;
};