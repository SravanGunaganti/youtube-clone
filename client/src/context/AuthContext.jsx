import React, { createContext, useContext, useEffect, useState } from "react";

import {
  saveToken,
  getUserFromToken,
  getToken,
  removeToken,
} from "../utils/authUtils";
import { handleAPIError, userAPI } from "../services/api";
import Loader from "../components/Loader";
// import { data } from "react-router-dom";

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
        return ;
      }
      setAuthUser(user);
      setIsLoggedIn(true);
      setLoading(false);
    }
    getUser();
  }, []);

  const login = async (res) => {
    try{
      const token = res?.accessToken;
      const userData = res?.data;
      if (token) {
        removeToken();
        saveToken(token);
      };
      if (userData) {
        setAuthUser(userData);
        setIsLoggedIn(true);
        setLoading(false);
      }
      return;
    } catch (error) {
      throw Error (handleAPIError(error).message);
    }
  };

  const logout = () => {
    removeToken();
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
