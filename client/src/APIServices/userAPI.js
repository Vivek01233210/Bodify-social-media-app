import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BONDIFY_API_URL;
const BASE_URL = `${BASE_API_URL}/user`;

export const registerAPI = async (userData) => {
    const response = await axios.post(`${BASE_URL}/register`, {
        username: userData?.username,
        password: userData?.password,
        email: userData?.email,
    }, {
        withCredentials: true
    });

    return response.data;
}

export const loginAPI = async (userData) => {
    const response = await axios.post(`${BASE_URL}/login`, {
        username: userData?.username,
        password: userData?.password,
    }, {
        withCredentials: true
    });

    return response.data;
}

// to check whether the user is logged in or not.
export const checkAuthStatusAPI = async () => {
    const response = await axios.get(`${BASE_URL}/checkAuthenticated`, {
        withCredentials: true
    });

    return response.data;
};

export const userProfileAPI = async () => {
    const response = await axios.get(`${BASE_URL}/profile`, {
        withCredentials: true
    });

    return response.data;
};

export const logoutAPI = async () => {
    const response = await axios.post(`${BASE_URL}/logout`, {}, {
        withCredentials: true
    });

    return response.data;
};

// follow user api
export const followUserAPI = async (userId) => {
    const response = await axios.put(`${BASE_URL}/follow/${userId}`, {}, {
        withCredentials: true
    });

    return response.data;
}; 

// unfollow user api
export const unfollowUserAPI = async (userId) => {
    const response = await axios.put(`${BASE_URL}/unfollow/${userId}`, {}, {
        withCredentials: true
    });

    return response.data;
};

// send email verification token
export const sendEmailVerificationTokenAPI = async () => {
    const response = await axios.put(`${BASE_URL}/account-verification-email`, {}, {
        withCredentials: true
    });

    return response.data;
};

// verify email account
export const verifyUserAccountAPI = async (verifyToken) => {
    const response = await axios.put(`${BASE_URL}/verify-account/${verifyToken}`, {}, {
        withCredentials: true
    });

    return response.data;
};

// forgot password api
export const forgotPasswordAPI = async (email) => {
    const response = await axios.post(`${BASE_URL}/forgot-password`, {
        email
    }, {
        withCredentials: true
    });

    return response.data;
};

// reset password api
export const resetPasswordAPI = async ({resetToken, password}) => {
    const response = await axios.post(`${BASE_URL}/reset-password/${resetToken}`, {
        password
    }, {
        withCredentials: true
    });

    return response.data;
};

// update email api
export const updateEmailAPI = async (email) => {
    const response = await axios.put(`${BASE_URL}/update-email`, {
        email
    }, {
        withCredentials: true
    });

    return response.data;
};

// upload profile picture
export const uploadProfilePicAPI = async (formData) => {
    const response = await axios.put(`${BASE_URL}/upload-profile-picture`, formData, {
        withCredentials: true
    });

    return response.data;
};

// list all users
export const listUsersAPI = async () => {
    const response = await axios.get(`${BASE_URL}/list-all-users`, {
        withCredentials: true
    });

    return response.data;
};

// block user
export const blockUserAPI = async (userId) => {
    const response = await axios.put(`${BASE_URL}/block-user`, {
        userId
    }, {
        withCredentials: true
    });

    return response.data;
};

// unblock user
export const unblockUserAPI = async (userId) => {
    const response = await axios.put(`${BASE_URL}/unblock-user`, {
        userId
    }, {
        withCredentials: true
    });

    return response.data;
};