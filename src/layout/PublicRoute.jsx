import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoute() {
  const isAuthenticated = !!localStorage.getItem("userId");
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

export default PublicRoute;
