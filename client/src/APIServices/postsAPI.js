import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BONDIFY_API_URL;
const BASE_URL = `${BASE_API_URL}/posts`;

export const createPostAPI = async (postData) => {
    const response = await axios.post(`${BASE_URL}/create`, postData, {
        withCredentials: true
    });
    return response.data;
}

export const getAllPostAPI = async (filters) => {
    const response = await axios.get(BASE_URL, {
        params: filters
    })
    return response.data;
}

export const getPostAPI = async (postId) => {
    const response = await axios.get(`${BASE_URL}/${postId}`, {
        withCredentials: true
    })
    return response.data;
}

export const updatePostAPI = async ({ formData, postId }) => {
    const response = await axios.put(`${BASE_URL}/${postId}`,
        formData,
        {
            withCredentials: true
        });
    return response.data;
}

export const deletePostAPI = async (postId) => {
    const response = await axios.delete(`${BASE_URL}/${postId}`, {
        withCredentials: true
    });
    return response.data;
}

// like post
export const likePostAPI = async (postId) => {
    const response = await axios.put(`${BASE_URL}/likes/${postId}`, {}, {
        withCredentials: true
    });
    return response.data;
}

// dislike post
export const dislikePostAPI = async (postId) => {
    const response = await axios.put(`${BASE_URL}/dislikes/${postId}`, {}, {
        withCredentials: true
    });
    return response.data;
}