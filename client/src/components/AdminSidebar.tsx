import { CalendarClock, Clock3, LayoutDashboard, LogOut, Stethoscope, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarClock },
  { to: "/admin/therapists", label: "Therapists", icon: Users },
  { to: "/admin/services", label: "Services", icon: Stethoscope },
  { to: "/admin/availability", label: "Availability", icon: Clock3 },
];

export function AdminSidebar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <aside className="flex h-screen w-64 flex-none flex-col border-r border-brand-sky/30 bg-white sticky top-0">
      <div className="border-b border-brand-sky/30 px-5 py-5">
        <p className="text-sm font-bold text-brand-blue-dark">Princy Admin</p>
        <p className="truncate text-xs text-brand-ink/50">{admin?.email}</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-brand-sky-light text-brand-blue-dark" : "text-brand-ink/70 hover:bg-brand-sky-light/60"
              }`
            }
          >
            <Icon size={17} aria-hidden="true" /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-brand-sky/30 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-ink/70 hover:bg-brand-sky-light/60"
        >
          <LogOut size={17} aria-hidden="true" /> Log out
        </button>
      </div>
    </aside>
  );
}
