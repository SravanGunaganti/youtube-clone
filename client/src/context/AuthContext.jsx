// src/context/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from "react";

// import axios from "axios";
import {
  saveToken,
  getUserFromToken,
  logoutUser,
  getToken,
} from "../utils/authUtils";
import { userAPI } from "../services/api";
import Loader from "../components/Loader";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [IsLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    async function getUser() {
      const user = await getUserFromToken();
      if (!user) {
        logout();
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }
      setAuthUser(user);
      setIsLoggedIn(true);
      setLoading(false);
    }
    getUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await userAPI.login({ email, password });
      const token = res.accessToken;
      if (token) {
        logoutUser();
        saveToken(token);
        const userData = await getUserFromToken();
        if (!userData) {
          logout();
          setIsLoggedIn(false);
          return;
        }
        setAuthUser(userData);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.log(err);
      const message =
        err?.response?.data?.error?.message || "Login failed. Try again!";
      throw new Error(message);
    }
  };

  const logout = () => {
    logoutUser();
    setAuthUser(null);
    setIsLoggedIn(false);
  };

  const updateAuthUser = (updatedUserData) => {
    if (!updatedUserData) return;
    setAuthUser(updatedUserData);
  };

  if (loading) return <Loader size="lg" />;

  return (
    <AuthContext.Provider
      value={{
        authUser,
        login,
        logout,
        updateAuthUser,
        IsLoggedIn,
        isLoggedIn: !!authUser,
        token: getToken(),
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
