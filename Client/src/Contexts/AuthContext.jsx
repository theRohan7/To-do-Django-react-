import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails, refreshAccessToken } from "../Services/auth.service";
import axios from "axios";
import { BACKEND_URL } from "../Utils/constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const user = await getUserDetails();
        setUserDetails(user);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        try {
          await refreshAccessToken();

          const user = await getUserDetails();
          setUserDetails(user);
          setIsAuthenticated(true);
        } catch (refreshErr) {
          console.error("Authentication failed:", refreshErr);
          setError(refreshErr.message);
          setIsAuthenticated(false);

          if (window.location.pathname !== "/auth") {
            navigate("/auth");
          }
        } finally {
            setLoading(false);
        }
      }
    };

    checkAuthStatus()
  }, [navigate]);

  const registerUser = async({ username, email, password }) => {
    try {
        const response = await axios.post(`${BACKEND_URL}register/`, {
            username,
            email,
            password
        });
        return response;
        
    } catch (error) {
        throw new Error(error.response.data.error);
    }
}

 const loginUser = async ({ email, password, remember=false }) => {
    try {
        const response = await axios.post(`${BACKEND_URL}login/`, {
            email,
            password,
        })
        if(response.status === 200 ){
            if(remember){
                localStorage.setItem("token", response.data.access);
                localStorage.setItem("refreshToken", response.data.refresh);
            } else {
                sessionStorage.setItem("token", response.data.access);
                sessionStorage.setItem("refreshToken", response.data.refresh);
            }
            setUserDetails(response.data.user);
            navigate("/");
            return true;
        }
        
    } catch (error) {
        throw new Error(error.response.data.error);
    }
 }


 const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    navigate("/auth");
}



  if (loading) {
    return <div>Loading Auth...</div>;
  }

  return (
    <AuthContext.Provider value={{ userDetails, error, setUserDetails, registerUser, loginUser, logoutUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
