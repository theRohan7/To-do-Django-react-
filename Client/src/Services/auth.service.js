import axios from "axios";
import { BACKEND_URL } from "../Utils/constants.js";

const registerUser = async({ username, email, password }) => {
    try {
        const response = await axios.post(`${BACKEND_URL}register/`, {
            username,
            email,
            password
        });
        return response;
        
    } catch (error) {
        throw new Error(error);
    }
}


const loginUser = async ({ email, password }) => {
    try {
        const response = await axios.post(`${BACKEND_URL}login/`, {
            email,
            password
        })
        return response;
        
    } catch (error) {
        throw new Error(error);
    }
}



export {
    registerUser,
    loginUser
}