import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './redux/store'; // Ajusta la ruta según tu estructura de archivos

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
