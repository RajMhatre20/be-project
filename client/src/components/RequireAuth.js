import React from "react";
import { Navigate } from "react-router-dom";

const RequireAuth = (Component) => {
  const isAuthenticated = localStorage.getItem("token");

  return isAuthenticated ? <Component /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
