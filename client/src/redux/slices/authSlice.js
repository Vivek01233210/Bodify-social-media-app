import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: "auth",
    initialState: {userAuth: null},
    reducers: {
        isAuthenticated: (state, action)=>{
            state.userAuth = action.payload;
        },
        logout: (state)=>{
            state.userAuth = null;
        },
        updateDp: (state, action) => {
            state.userAuth.profilePicture = action.payload;
        }
    }
});

// get the actions
export const {isAuthenticated, logout, updateDp} = authSlice.actions;

// get the reducer
const authReducer = authSlice.reducer;
export default authReducer;