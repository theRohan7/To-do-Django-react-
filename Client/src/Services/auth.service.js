import axios from "axios";
import { BACKEND_URL } from "../Utils/constants.js";






const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
        
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }
        
        const response = await axios.post(`${BACKEND_URL}token/refresh/`, {
            refresh: refreshToken
        });
        

        if (localStorage.getItem("token")) {
            localStorage.setItem("token", response.data.access);
        } else {
            sessionStorage.setItem("token", response.data.access);
        }
        
        return response.data.access;
    } catch (error) {

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("refreshToken");
        throw new Error("Session expired. Please login again.");
    }
}

const getUserDetails = async () => {
    try {
        const response = await axiosWithAuth.get(`${BACKEND_URL}user/`);
        return response.data.user;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to fetch user details");
    }
}



export {
    refreshAccessToken,
    getUserDetails
}