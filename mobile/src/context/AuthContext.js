import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

async function saveSession(session) {
  await AsyncStorage.multiSet([
    ["crave_token", session?.token || ""],
    ["crave_user", JSON.stringify(session?.user || null)]
  ]);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem("crave_token");
      const storedUser = await AsyncStorage.getItem("crave_user");
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      try {
        if (storedToken) {
          const me = await api.me();
          setUser(me);
          await saveSession({ token: storedToken, user: me });
        }
      } catch {
        await AsyncStorage.multiRemove(["crave_token", "crave_user"]);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const login = async ({ username, password }) => {
    const result = await api.login({ username, password });
    setUser(result.user);
    setToken(result.token);
    await saveSession(result);
    return result;
  };

  const register = async (payload) => {
    const result = await api.register(payload);
    setUser(result.user);
    setToken(result.token);
    await saveSession(result);
    return result;
  };

  const logout = async () => {
    setUser(null);
    setToken("");
    await AsyncStorage.multiRemove(["crave_token", "crave_user"]);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      setUser
    }),
    [login, logout, ready, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return value;
}
