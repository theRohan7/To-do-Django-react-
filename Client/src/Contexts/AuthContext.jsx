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

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
        if(token){
           fetchUserData(token)
        } else {
            setLoading(false);
        }
  }, []);


  const fetchUserData = async (token) => {
    try {
      const user = await getUserDetails(token);
      if (user) {
        setUserDetails(user);
      } 
    } catch (error) {
      console.error("Error fetching user:", error);
      logoutUser();
    } finally {
      setLoading(false);
    }
  };



  const registerUser = async ({ username, email, password }) => {    
    try {
      const response = await axios.post(`${BACKEND_URL}register/`, {
        username,
        email,
        password,
      });
      return response;
    } catch (error) {
      throw new Error(error.response.data);
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
          await fetchUserData(response.data.access);
        } else {
          sessionStorage.setItem("token", response.data.access);
        }
        navigate("/");
        return true;
      }
    } catch (error) {
      console.log(error);
      throw new Error(error.response.data.error);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUserDetails(null);
    navigate("/auth");
  };

  if (loading) {
    return <div>Loading Auth...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        userDetails, setUserDetails, logoutUser, loginUser, registerUser,fetchUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
