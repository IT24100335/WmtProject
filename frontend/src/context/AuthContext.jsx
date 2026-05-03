import { createContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { clearAuth, loadAuth, saveAuth } from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuth());
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      if (!auth?.token) {
        setBootstrapping(false);
        return;
      }

      try {
        const user = await authApi.me(auth.token);
        const nextAuth = { token: auth.token, user };
        setAuth(nextAuth);
        saveAuth(nextAuth);
      } catch (_error) {
        setAuth(null);
        clearAuth();
      } finally {
        setBootstrapping(false);
      }
    };

    hydrate();
  }, []);

  const login = async (credentials) => {
    const result = await authApi.login(credentials);
    setAuth(result);
    saveAuth(result);
    return result;
  };

  const register = async (payload) => {
    const result = await authApi.register(payload);
    setAuth(result);
    saveAuth(result);
    return result;
  };

  const logout = () => {
    setAuth(null);
    clearAuth();
  };

  const updateAuthUser = (nextUser) => {
    if (!auth?.token) {
      return;
    }

    const nextAuth = { token: auth.token, user: nextUser };
    setAuth(nextAuth);
    saveAuth(nextAuth);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        user: auth?.user || null,
        token: auth?.token || null,
        isAuthenticated: Boolean(auth?.token),
        bootstrapping,
        login,
        register,
        logout,
        updateAuthUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
