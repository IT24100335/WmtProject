import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { api } from "../../api/client";
import { Button, Card, Field, Heading, Screen } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";
import { requiredText, isEmail } from "../../utils/validators";

export function ProfileScreen() {
  const { user, setUser, logout } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    if (user) {
      setForm({ username: user.username || "", email: user.email || "", password: "" });
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        setFeedbacks(await api.myFeedback());
      } catch (err) {
        // silently ignore error if myFeedback fails
      }
    })();
  }, []);

  const save = async () => {
    if (!requiredText(form.username, 3)) return setError("Username must be at least 3 characters.");
    if (form.email && !isEmail(form.email)) return setError("Enter a valid email address.");
    if (form.password && form.password.length < 6) return setError("Password must be at least 6 characters.");

    try {
      const updated = await api.updateUser(user._id, {
        username: form.username,
        email: form.email,
        password: form.password || undefined
      });
      setUser(updated);
      setNotice("Profile updated successfully.");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Heading title="My profile" subtitle="Update your account and view your activity." />
        <Card>
          {error ? <Text style={{ color: "#ff9e8a" }}>{error}</Text> : null}
          {notice ? <Text style={{ color: "#7ef0a5" }}>{notice}</Text> : null}
          <Field label="Username" value={form.username} onChangeText={(username) => setForm((prev) => ({ ...prev, username }))} />
          <Field label="Email" value={form.email} onChangeText={(email) => setForm((prev) => ({ ...prev, email }))} />
          <Field label="Password" secureTextEntry value={form.password} onChangeText={(password) => setForm((prev) => ({ ...prev, password }))} />
          <Button title="Save profile" onPress={save} />
        </Card>

        {feedbacks.length > 0 && (
          <>
            <Heading title="My Feedback" subtitle="Your recent reviews" />
            {feedbacks.map((item) => (
              <Card key={item._id}>
                <Text style={{ color: "#fff6f0", fontWeight: "800", fontSize: 16 }}>{item.menuItemId?.name || "Deleted item"}</Text>
                <Text style={{ color: "#ff8d56", fontWeight: "700", marginTop: 4 }}>Rating: {item.rating} / 5</Text>
                <Text style={{ color: "#d7b9aa", marginTop: 4 }}>{item.comment || "No comment"}</Text>
              </Card>
            ))}
          </>
        )}

        <View style={{ marginTop: 24, marginBottom: 40 }}>
          <Button title="Log Out" variant="danger" onPress={logout} />
        </View>
      </ScrollView>
    </Screen>
  );
}
