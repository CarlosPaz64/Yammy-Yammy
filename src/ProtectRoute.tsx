import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './hooks/reduxHooks'; // Asegúrate de que esta ruta sea correcta

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAppSelector(
    (state) => state.auth?.isAuthenticated ?? false // Evalúa correctamente el estado
  );

  console.log('Estado de autenticación en ProtectedRoute:', isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
