import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../Services/auth.service";
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
        setLoading(true);
        try {
          const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");
  
          if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            navigate("/auth");
            return;
          }
  
          const user = await getUserDetails(token);
          if (user) {
            setUserDetails(user);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            navigate("/auth");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setIsAuthenticated(false);
          navigate("/auth");
        } finally {
          setLoading(false);
        }
      };
  
      checkAuthStatus();
  }, []);


  const registerUser = async ({ username, email, password }) => {
    try {
      const response = await axios.post(`${BACKEND_URL}register/`, {
        username,
        email,
        password,
      });
      return response;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  };

  const loginUser = async ({ email, password, remember = false }) => {
    try {
      const response = await axios.post(`${BACKEND_URL}login/`, {
        email,
        password,
      });
      if (response.status === 200) {
        if (remember) {
          localStorage.setItem("token", response.data.access);
          localStorage.setItem("refreshToken", response.data.refresh);
        } else {
          sessionStorage.setItem("token", response.data.access);
          sessionStorage.setItem("refreshToken", response.data.refresh);
        }
        setUserDetails(response.data.user);
        setIsAuthenticated(true);
        navigate("/");
        return true;
      }
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUserDetails(null);
    setIsAuthenticated(false);
    navigate("/auth");
  };

  if (loading) {
    return <div>Loading Auth...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        userDetails, isAuthenticated, setUserDetails, logoutUser, loginUser, registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
