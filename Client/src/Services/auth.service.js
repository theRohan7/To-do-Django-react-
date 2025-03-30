import axios from "axios";
import { BACKEND_URL } from "../Utils/constants.js";


const getUserDetails = async (token) => {
    try {
        const response = await axios.get(`${BACKEND_URL}user/`,{
            headers: {
                Authorization: token,
            }
        })
        return response.data.user;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to fetch user details");
    }
}



export {
    getUserDetails
}