import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAdminAccessToken } from "../../src/api/adminAxios";

const ProtectedRoute = () => {
  const token = getAdminAccessToken();

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
