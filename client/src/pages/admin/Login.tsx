import { Ear } from "lucide-react";
import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Seo } from "../../components/Seo";
import { useAuth } from "../../hooks/useAuth";
import { ApiError } from "../../services/api";

export default function AdminLogin() {
  const { admin, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && admin) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? "/admin/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not log in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Seo title="Admin Login" description="Admin login for Princy Hear and Speech Rehab." />
      <div className="flex min-h-screen items-center justify-center bg-brand-sky-light px-4">
        <Card className="w-full max-w-sm p-6 sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-white">
              <Ear size={22} aria-hidden="true" />
            </span>
            <h1 className="text-lg font-bold text-brand-ink">Princy Admin</h1>
            <p className="text-xs text-brand-ink/50">Sign in to manage appointments and content.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-brand-ink">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-brand-ink">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
              />
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <Button type="submit" disabled={submitting} className="w-full justify-center">
              {submitting ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
