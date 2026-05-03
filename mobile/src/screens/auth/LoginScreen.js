import { useNavigation, useRoute } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { ScrollView, Text } from "react-native";
import { Button, Card, Field, Heading, Screen } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";
import { isAdminRole } from "../../utils/roles";
import { requiredText } from "../../utils/validators";

export function LoginScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const mode = route.params?.mode || "customer";
  const isAdminLogin = mode === "admin";
  const { login, logout } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const copy = useMemo(
    () =>
      isAdminLogin
        ? {
            title: "Admin login",
            subtitle: "Access menu, orders, promotions, inventory, feedback, and users."
          }
        : {
            title: "Customer login",
            subtitle: "Order food, pay, and track your activity."
          },
    [isAdminLogin]
  );

  const submit = async () => {
    const nextErrors = [];
    if (!requiredText(form.username, 3)) nextErrors.push("Username must be at least 3 characters.");
    if (!requiredText(form.password, 6)) nextErrors.push("Password must be at least 6 characters.");
    if (nextErrors.length) {
      setError(nextErrors[0]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await login(form);
      if (isAdminLogin && !isAdminRole(result.user.role)) {
        await logout();
        setError("This account does not have admin access.");
      } else if (!isAdminLogin && isAdminRole(result.user.role)) {
        await logout();
        setError("Please use the admin login screen for this account.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 24 }}>
        <Heading title={copy.title} subtitle={copy.subtitle} />
        <Card>
          {error ? <Text style={{ color: "#ff9e8a" }}>{error}</Text> : null}
          <Field
            autoCapitalize="none"
            label="Username"
            onChangeText={(text) => setForm((prev) => ({ ...prev, username: text }))}
            value={form.username}
          />
          <Field
            autoCapitalize="none"
            label="Password"
            onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
            secureTextEntry
            value={form.password}
          />
          <Button title={loading ? "Signing in..." : "Login"} onPress={submit} disabled={loading} />
          {isAdminLogin ? (
            <Button title="Back to home" variant="ghost" onPress={() => navigation.navigate("Portal")} />
          ) : null}
          {!isAdminLogin ? (
            <Button title="Create account" variant="ghost" onPress={() => navigation.navigate("CustomerRegister")} />
          ) : null}
        </Card>
      </ScrollView>
    </Screen>
  );
}
