import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, Text } from "react-native";
import { Button, Card, Field, Heading, Screen } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";
import { requiredText, isEmail } from "../../utils/validators";

export function RegisterScreen() {
  const navigation = useNavigation();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!requiredText(form.username, 3)) return setError("Username must be at least 3 characters.");
    if (!isEmail(form.email)) return setError("Enter a valid email address.");
    if (!requiredText(form.password, 6)) return setError("Password must be at least 6 characters.");

    setLoading(true);
    setError("");
    try {
      await register({ ...form, role: "CUSTOMER" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 24 }}>
        <Heading title="Customer sign up" subtitle="Create an account to place orders and track activity." />
        <Card>
          {error ? <Text style={{ color: "#ff9e8a" }}>{error}</Text> : null}
          <Field
            label="Username"
            onChangeText={(text) => setForm((prev) => ({ ...prev, username: text }))}
            value={form.username}
          />
          <Field
            keyboardType="email-address"
            label="Email"
            onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
            value={form.email}
          />
          <Field
            label="Password"
            onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
            secureTextEntry
            value={form.password}
          />
          <Button title={loading ? "Creating..." : "Sign up"} onPress={submit} disabled={loading} />
          <Button title="Back to login" variant="ghost" onPress={() => navigation.navigate("CustomerLogin")} />
        </Card>
      </ScrollView>
    </Screen>
  );
}
