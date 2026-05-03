import { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { api } from "../../api/client";
import { Button, Card, Field, Heading, Pill, Screen } from "../../components/UI";
import { requiredText, isDateIso, isMoney } from "../../utils/validators";

const empty = { id: "", name: "", promoCode: "", discountPercentage: "10", expiryDate: "", active: true };

export function AdminPromotionsScreen() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await api.promotions());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!requiredText(form.name, 2)) return setError("Promotion name is required.");
    if (!requiredText(form.promoCode, 2)) return setError("Promo code is required.");
    if (!isMoney(form.discountPercentage) || Number(form.discountPercentage) > 100) return setError("Discount must be 0-100.");
    if (!isDateIso(form.expiryDate)) return setError("Expiry date must be YYYY-MM-DD.");

    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        promoCode: form.promoCode.toUpperCase(),
        discountPercentage: Number(form.discountPercentage),
        expiryDate: form.expiryDate,
        active: form.active
      };
      if (form.id) await api.updatePromotion(form.id, payload);
      else await api.createPromotion(payload);
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
        <Heading title="Promotions" subtitle="Manage promo codes and discounts." />
        {error ? <Text style={{ color: "#ff9e8a" }}>{error}</Text> : null}
        <Card>
          <Field label="Name" value={form.name} onChangeText={(name) => setForm((prev) => ({ ...prev, name }))} />
          <Field label="Promo code" value={form.promoCode} onChangeText={(promoCode) => setForm((prev) => ({ ...prev, promoCode }))} />
          <Field label="Discount %" keyboardType="numeric" value={form.discountPercentage} onChangeText={(discountPercentage) => setForm((prev) => ({ ...prev, discountPercentage }))} />
          <Field label="Expiry date" value={form.expiryDate} onChangeText={(expiryDate) => setForm((prev) => ({ ...prev, expiryDate }))} placeholder="YYYY-MM-DD" />
          <Button title={saving ? "Saving..." : "Save promotion"} onPress={save} disabled={saving} />
        </Card>
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card>
              <Text style={{ color: "#fff6f0", fontWeight: "800" }}>{item.name}</Text>
              <Text style={{ color: "#d7b9aa" }}>{item.promoCode}</Text>
              <Pill title={`${item.discountPercentage}%`} tone="success" />
              <Text style={{ color: "#d7b9aa" }}>{item.expiryDate}</Text>
              <Button title="Edit" variant="ghost" onPress={() => setForm({ id: item._id, ...item })} />
              <Button
                title="Delete"
                variant="danger"
                onPress={async () => {
                  await api.deletePromotion(item._id);
                  load();
                }}
              />
            </Card>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          scrollEnabled={false}
        />
      </ScrollView>
    </Screen>
  );
}
