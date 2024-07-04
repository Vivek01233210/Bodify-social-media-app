import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice.js";

// create store
export const store = configureStore({
    reducer:{
        auth: authReducer
    }
});