import axios from "axios";
import { BACKEND_URL } from "../Utils/constants.js";




const createTask = async ({ title, description, category }) => {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.post(`${BACKEND_URL}tasks/create/`, {
            title,
            description,
            category,
        },{
            headers: {
                Authorization: token,
            }
        })
        return response;
    } catch (error) {
        throw new Error(error.response.data.error);
    }
}


const updateTask = async (id, taskDetails) => {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.put(`${BACKEND_URL}tasks/${id}/update/`, {
           ...taskDetails
        },{
            headers: {
                Authorization: token,
            }
        }) 
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.error);
    }
}

const deleteTask = async (id) => {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.delete(`${BACKEND_URL}tasks/${id}/delete/`, {
            headers: {
                Authorization: token,
            }
        }) 
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.error);
    }
}

const fetchAllTasks = async () => {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.get(`${BACKEND_URL}tasks/`, {
            headers: {
                Authorization: token,
            }
        })  
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.error);
    }
}

const fetchTaskDetails = async (id) => {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.get(`${BACKEND_URL}tasks/${id}/`, {
            headers: {
                Authorization: token,
            }
        })        
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.error);
    }
}


const chnageTaskCategory = async (id, category) => {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.put(`${BACKEND_URL}tasks/${id}/category/`, {
            category
        },{
            headers: {
                Authorization: token,
            }
        })       
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.error);
    }
}


export {
    createTask,
    updateTask,
    deleteTask,
    fetchAllTasks,
    fetchTaskDetails,
    chnageTaskCategory
}