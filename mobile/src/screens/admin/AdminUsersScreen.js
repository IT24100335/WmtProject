import { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { api } from "../../api/client";
import { Button, Card, Field, Heading, Pill, Screen } from "../../components/UI";
import { formatRole } from "../../utils/roles";
import { isEmail, requiredText } from "../../utils/validators";

const empty = { id: "", username: "", email: "", password: "", role: "CUSTOMER" };

export function AdminUsersScreen() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      setItems(await api.users());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!requiredText(form.username, 3)) return setError("Username is required.");
    if (form.email && !isEmail(form.email)) return setError("Email must be valid.");
    if (!form.id && !requiredText(form.password, 6)) return setError("Password must be at least 6 characters.");

    try {
      if (form.id) {
        await api.updateUser(form.id, {
          username: form.username,
          email: form.email,
          password: form.password || undefined,
          role: form.role
        });
      } else {
        await api.createUser({
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role
        });
      }
      setForm(empty);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Heading title="Users" subtitle="Create team accounts and manage roles." />
        {error ? <Text style={{ color: "#ff9e8a" }}>{error}</Text> : null}
        <Card>
          <Field label="Username" value={form.username} onChangeText={(username) => setForm((prev) => ({ ...prev, username }))} />
          <Field label="Email" value={form.email} onChangeText={(email) => setForm((prev) => ({ ...prev, email }))} />
          <Field label="Password" secureTextEntry value={form.password} onChangeText={(password) => setForm((prev) => ({ ...prev, password }))} />
          <Field label="Role" value={form.role} onChangeText={(role) => setForm((prev) => ({ ...prev, role }))} placeholder="CUSTOMER / ADMIN / MANAGER" />
          <Button title="Save user" onPress={save} />
        </Card>
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card>
              <Text style={{ color: "#fff6f0", fontWeight: "800" }}>{item.username}</Text>
              <Text style={{ color: "#d7b9aa" }}>{item.email || "-"}</Text>
              <Pill title={formatRole(item.role)} />
              <Button title="Edit" variant="ghost" onPress={() => setForm({ id: item._id, username: item.username, email: item.email || "", password: "", role: item.role })} />
              <Button
                title="Delete"
                variant="danger"
                onPress={async () => {
                  await api.deleteUser(item._id);
                  load();
                }}
              />
            </Card>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      </ScrollView>
    </Screen>
  );
}
