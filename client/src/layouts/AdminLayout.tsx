import { Navigate, Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/AdminSidebar";
import { AdminWatermark } from "../components/AdminWatermark";
import { useAuth } from "../hooks/useAuth";

export function AdminLayout() {
  const { admin, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-brand-ink/60">Loading…</div>;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-brand-sky-light/30">
      <AdminSidebar />
      <AdminWatermark />
      <div className="relative z-10 min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
