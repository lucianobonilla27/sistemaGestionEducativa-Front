import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useUser();

  if (!user) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/login" />;
  }

  if (requiredRole) {
    // Convertir a array si no lo es
    const rolesPermitidos = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];

    // Si el rol del usuario no está en los roles permitidos, denegar acceso
    if (!rolesPermitidos.includes(user.role)) {
      return <Navigate to="/unauthorized" />;
    }
  }

  // Si está autenticado y tiene el rol correcto, renderizar el contenido
  return children;
}

export default ProtectedRoute;
