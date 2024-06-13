import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRouter({ element: Element }) {
  const isAuthenticated = useSelector((state) => state.authReducer.isLogin);

  return <>{isAuthenticated ? Element : <Navigate replace to="/login" />}</>;
}
export default ProtectedRouter;
