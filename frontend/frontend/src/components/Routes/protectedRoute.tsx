import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("Admin" | "Terapeuta")[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { usuario, estaAutenticado } = useAuth();
  const token = localStorage.getItem("token");

  if (!estaAutenticado || !token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && (!usuario || !allowedRoles.includes(usuario.perfil))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
