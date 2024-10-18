import React from 'react';
import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('token');
  console.log('Token en localStorage:', token); // Verificar si el token está disponible


  // Si no hay token, redirige a la página de login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si hay token, renderiza los hijos (la vista protegida)
  return <>{children}</>;
};

export default PrivateRoute;