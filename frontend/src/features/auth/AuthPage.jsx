import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { useAuth } from "../../hooks/useAuth";
import { getDefaultAdminTab } from "../../utils/adminAccess";
import { isAdminRole } from "../../utils/roles";

const COPY = {
  "customer-login": {
    eyebrow: "Customer Login",
    title: "Welcome back to Crave Bites",
    text: "Sign in to order food, track delivery, and manage your profile.",
    submit: "Login",
    alternateText: "Need a new customer account?",
    alternateLink: "/customer/register",
    alternateLabel: "Sign up"
  },
  "customer-register": {
    eyebrow: "Customer Sign Up",
    title: "Create your customer account",
    text: "Register once and start ordering from the customer app.",
    submit: "Create account",
    alternateText: "Already have a customer account?",
    alternateLink: "/customer/login",
    alternateLabel: "Login"
  },
  "admin-login": {
    eyebrow: "Admin Portal",
    title: "Admin sign in",
    text: "Access the back office dashboard for menu, orders, promotions, inventory, and users.",
    submit: "Login",
    alternateText: "Need the customer app instead?",
    alternateLink: "/customer/login",
    alternateLabel: "Customer Login"
  }
};

export function AuthPage({ variant = "customer-login" }) {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, logout, user } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isSignup = variant === "customer-register";
  const isAdminLogin = variant === "admin-login";
  const copy = useMemo(() => COPY[variant] || COPY["customer-login"], [variant]);

  const validate = () => {
    const next = {};
    if (!form.username.trim() || form.username.trim().length < 3) {
      next.username = "Username must be at least 3 characters.";
    }
    if (isSignup && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!form.password.trim() || form.password.trim().length < 6) {
      next.password = "Password must be at least 6 characters.";
    }
    return next;
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    if (isAdminRole(user.role)) {
      navigate(`/admin?tab=${getDefaultAdminTab(user.role)}`, { replace: true });
      return;
    }

    navigate("/customer", { replace: true });
  }, [isAuthenticated, navigate, user]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const nextErrors = validate();
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setError("Please fix the highlighted fields.");
      setLoading(false);
      return;
    }

    try {
      if (isSignup) {
        await register({ ...form, role: "CUSTOMER" });
        navigate("/customer", { replace: true });
        return;
      }

      const result = await login({ username: form.username, password: form.password });

      if (isAdminLogin && !isAdminRole(result.user?.role)) {
        logout();
        throw new Error("This account does not have admin access.");
      }

      if (!isAdminLogin && isAdminRole(result.user?.role)) {
        logout();
        throw new Error("Please use the admin login for administrator accounts.");
      }

      navigate(
        isAdminLogin ? `/admin?tab=${getDefaultAdminTab(result.user?.role)}` : "/customer",
        { replace: true }
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <section className="auth-page">
        <div className="auth-copy">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.text}</p>
        </div>
        <form className="auth-card" onSubmit={submit}>
          <h2>{copy.submit}</h2>
          {error ? <p className="error-text">{error}</p> : null}
          <label>
            Username
            <input
              value={form.username}
              onChange={(event) => {
                const username = event.target.value;
                setForm((prev) => ({ ...prev, username }));
                setFieldErrors((prev) => ({ ...prev, username: "" }));
              }}
              required
            />
            {fieldErrors.username ? <span className="field-error">{fieldErrors.username}</span> : null}
          </label>
          {isSignup ? (
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => {
                  const email = event.target.value;
                  setForm((prev) => ({ ...prev, email }));
                  setFieldErrors((prev) => ({ ...prev, email: "" }));
                }}
              />
              {fieldErrors.email ? <span className="field-error">{fieldErrors.email}</span> : null}
            </label>
          ) : null}
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => {
                const password = event.target.value;
                setForm((prev) => ({ ...prev, password }));
                setFieldErrors((prev) => ({ ...prev, password: "" }));
              }}
              required
            />
            {fieldErrors.password ? <span className="field-error">{fieldErrors.password}</span> : null}
          </label>
          <button className="primary-btn wide-btn" disabled={loading} type="submit">
            {loading ? "Working..." : copy.submit}
          </button>
          <p className="muted-text">
            {copy.alternateText} <Link to={copy.alternateLink}>{copy.alternateLabel}</Link>
          </p>
        </form>
      </section>
    </AppShell>
  );
}
