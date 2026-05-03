import { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { api } from "../../api/client";
import { Button, Card, Field, Heading, Pill, Screen } from "../../components/UI";
import { isMoney, requiredText } from "../../utils/validators";

const empty = { id: "", name: "", quantity: "", unit: "", threshold: "" };

export function AdminInventoryScreen() {
  const [items, setItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [pantryRes, menuRes] = await Promise.all([
        api.pantry(),
        api.menu()
      ]);
      setItems(pantryRes);
      setMenuItems(menuRes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const savePantry = async () => {
    if (!requiredText(form.name, 2)) return setError("Name is required.");
    if (!isMoney(form.quantity)) return setError("Quantity must be zero or more.");
    if (!requiredText(form.unit, 1)) return setError("Unit is required.");
    if (!isMoney(form.threshold)) return setError("Threshold must be zero or more.");

    setSaving(true);
    setError("");
    try {
      if (form.id) {
        await api.savePantry(form.id, {
          name: form.name,
          quantity: Number(form.quantity),
          unit: form.unit,
          threshold: Number(form.threshold)
        });
      } else {
        await api.savePantry("", {
          name: form.name,
          quantity: Number(form.quantity),
          unit: form.unit,
          threshold: Number(form.threshold)
        });
      }
      setForm(empty);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Heading title="Menu Stock" subtitle="Manage available quantities for menu items." />
        {error ? <Text style={{ color: "#ff9e8a" }}>{error}</Text> : null}
        
        {menuItems.map(menuItem => (
          <Card key={menuItem._id}>
            <Text style={{ color: "#fff6f0", fontWeight: "800" }}>{menuItem.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Text style={{ color: "#d7b9aa" }}>Stock: {menuItem.stock}</Text>
              <Button 
                title="+5" 
                variant="ghost" 
                style={{ paddingVertical: 6, paddingHorizontal: 12 }} 
                onPress={async () => {
                  try {
                    await api.updateMenuStock(menuItem._id, menuItem.stock + 5);
                    load();
                  } catch(e) {
                    setError(e.message);
                  }
                }} 
              />
              <Button 
                title="-5" 
                variant="ghost" 
                style={{ paddingVertical: 6, paddingHorizontal: 12 }} 
                onPress={async () => {
                  if (menuItem.stock < 5) return;
                  try {
                    await api.updateMenuStock(menuItem._id, menuItem.stock - 5);
                    load();
                  } catch(e) {
                    setError(e.message);
                  }
                }} 
              />
            </View>
          </Card>
        ))}

        <View style={{ height: 16 }} />
        
        <Heading title="Pantry Inventory" subtitle="Track raw ingredients and low-stock warnings." />
        <Card>
          <Field label="Name" value={form.name} onChangeText={(name) => setForm((prev) => ({ ...prev, name }))} />
          <Field label="Quantity" keyboardType="numeric" value={form.quantity} onChangeText={(quantity) => setForm((prev) => ({ ...prev, quantity }))} />
          <Field label="Unit" value={form.unit} onChangeText={(unit) => setForm((prev) => ({ ...prev, unit }))} />
          <Field label="Threshold" keyboardType="numeric" value={form.threshold} onChangeText={(threshold) => setForm((prev) => ({ ...prev, threshold }))} />
          <Button title={saving ? "Saving..." : "Save pantry item"} onPress={savePantry} disabled={saving} />
        </Card>
        
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card>
              <Text style={{ color: "#fff6f0", fontWeight: "800" }}>{item.name}</Text>
              <Text style={{ color: "#d7b9aa" }}>
                {item.quantity} {item.unit}
              </Text>
              <Pill title={item.quantity <= item.threshold ? "Low stock" : "In stock"} tone={item.quantity <= item.threshold ? "danger" : "success"} />
              <Button title="Edit" variant="ghost" onPress={() => setForm({ id: item._id, ...item })} />
              <Button
                title="Delete"
                variant="danger"
                onPress={async () => {
                  await api.deletePantry(item._id);
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
