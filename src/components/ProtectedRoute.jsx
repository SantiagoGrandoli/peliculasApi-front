import { Redirect } from "wouter";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (requireAdmin && !user?.roles?.includes("Admin")) {
    return (
      <div className="container page">
        <div className="empty-state">
          <h2>Acceso restringido</h2>
          <p>Esta sección es solo para administradores.</p>
        </div>
      </div>
    );
  }

  return children;
}
