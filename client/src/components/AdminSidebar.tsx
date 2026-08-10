import { CalendarClock, Clock3, LayoutDashboard, LogOut, Menu, Stethoscope, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [open, setOpen] = useState(false);

  // Lock background scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate("/admin/login");
  }

  const navContent = (
    <>
      <div className="border-b border-brand-sky/30 px-5 py-5">
        <p className="text-sm font-bold text-brand-blue-dark">Princy Admin</p>
        <p className="truncate text-xs text-brand-ink/50">{admin?.email}</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
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
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-brand-ink/70 hover:bg-brand-sky-light/60"
        >
          <LogOut size={17} aria-hidden="true" /> Log out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-brand-sky/30 bg-white px-4 py-3 lg:hidden">
        <p className="text-sm font-bold text-brand-blue-dark">Princy Admin</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          className="flex h-11 w-11 items-center justify-center rounded-full text-brand-ink hover:bg-brand-sky-light"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </header>

      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-brand-ink/40 transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile drawer */}
      <aside
        id="admin-mobile-nav"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl transition-transform duration-200 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end px-3 pt-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close admin menu"
            className="flex h-11 w-11 items-center justify-center rounded-full text-brand-ink/60 hover:bg-brand-sky-light"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">{navContent}</div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-none flex-col border-r border-brand-sky/30 bg-white lg:flex">
        {navContent}
      </aside>
    </>
  );
}
