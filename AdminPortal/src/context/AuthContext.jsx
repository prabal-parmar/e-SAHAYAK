import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getAdminAccessToken,
  logoutAdmin as apiLogoutAdmin,
} from "../api/adminAxios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getAdminAccessToken());
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    apiLogoutAdmin();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);







