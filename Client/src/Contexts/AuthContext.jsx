import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../Utils/constants";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token){
            checkAuth(token)
        } else {
            setLoading(false);
        }
    }, [])

    const checkAuth = async (token) => {
        try {
            const response = await axios.get(`${BACKEND_URL}user/`, {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            });
            
            if (response.status === 401) {
              localStorage.removeItem('token');
              return false;
            }
            if (response.status === 200) {
                setUserDetails(response.data.user);
                setLoading(false);
                navigate("/");
                return true;
            }
            
          } catch (error) {
            console.error('Auth check failed:', error);
            setError(error);
            return false;
          }
    }




    if(loading){
        return <div>Loading Auth...</div>
    }

    return (
        <AuthContext.Provider value={{userDetails, error, setUserDetails}} >
            {children}
        </AuthContext.Provider>
    )
}