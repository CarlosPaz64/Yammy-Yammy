import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './redux/store'; 

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAppSelector(
    (state) => state.auth?.isAuthenticated ?? false
  );

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
