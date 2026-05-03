import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { api } from "../../api/client";
import { Button, Card, Field, Heading, Pill, Screen } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { requiredText } from "../../utils/validators";

export function CartScreen() {
  const { user } = useAuth();
  const { items, promo, setPromo, promoCode, setPromoCode, address, setAddress, subtotal, discount, total, clearCart } = useCart();
  const [payment, setPayment] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const applyPromo = async () => {
    try {
      if (!requiredText(promoCode, 2)) {
        setErrors((prev) => ({ ...prev, promo: "Enter a promo code first." }));
        return;
      }
      const result = await api.validatePromo(promoCode.trim().toUpperCase());
      setPromo(result);
      setErrors((prev) => ({ ...prev, promo: "" }));
    } catch (err) {
      setPromo(null);
      setErrors((prev) => ({ ...prev, promo: err.message }));
    }
  };

  const checkout = async () => {
    const next = {};
    if (!requiredText(address, 6)) next.address = "Enter a valid delivery address.";
    if (!requiredText(payment.name, 3)) next.name = "Card holder is required.";
    if (!/^\d{16}$/.test(payment.number.replace(/\s+/g, ""))) next.number = "Card number must be 16 digits.";
    const expiryMatch = payment.expiry.trim().match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!expiryMatch) {
      next.expiry = "Use valid MM/YY format.";
    } else {
      const month = parseInt(expiryMatch[1], 10);
      const year = parseInt(expiryMatch[2], 10) + 2000;
      const now = new Date();
      if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
        next.expiry = "Card has expired.";
      }
    }
    if (!/^\d{3,4}$/.test(payment.cvv)) next.cvv = "CVV must be 3 or 4 digits.";
    if (!items.length) next.form = "Add at least one item.";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    setBusy(true);
    setErrors({});
    try {
      await api.createOrder({
        promoCode: promo?.promoCode,
        deliveryAddress: address,
        items: items.map((item) => ({ menuItemId: item._id, quantity: item.quantity }))
      });
      Alert.alert("Success", "Payment approved and order placed successfully.");
      clearCart();
      setPromo(null);
      setPromoCode("");
      setAddress("");
      setPayment({ name: "", number: "", expiry: "", cvv: "" });
    } catch (err) {
      Alert.alert("Checkout failed", err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 24 }}>
        <Heading title="Cart" subtitle="Review items, apply a promo code, and simulate payment checkout." />
        <Card>
          {!items.length ? <Text style={{ color: "#d7b9aa" }}>Your cart is empty.</Text> : null}
          {items.map((item) => (
            <View key={item._id} style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
              <Text style={{ color: "#fff6f0", flex: 1 }}>
                {item.name} x {item.quantity}
              </Text>
              <Text style={{ color: "#ff8d56", fontWeight: "700" }}>Rs {(Number(item.price) * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <Pill title={`Subtotal Rs ${subtotal.toFixed(2)}`} />
          <Pill title={`Discount Rs ${discount.toFixed(2)}`} tone="success" />
          <Pill title={`Total Rs ${total.toFixed(2)}`} tone="success" />
        </Card>

        <Card>
          <Field label="Promo code" value={promoCode} onChangeText={setPromoCode} autoCapitalize="characters" />
          {errors.promo ? <Text style={{ color: "#ff9e8a" }}>{errors.promo}</Text> : null}
          <Button title="Apply promo" variant="ghost" onPress={applyPromo} />
        </Card>

        <Card>
          <Field label="Delivery address" value={address} onChangeText={setAddress} />
          {errors.address ? <Text style={{ color: "#ff9e8a" }}>{errors.address}</Text> : null}
        </Card>

        <Card>
          <Field label="Card holder" value={payment.name} onChangeText={(name) => setPayment((prev) => ({ ...prev, name }))} />
          {errors.name ? <Text style={{ color: "#ff9e8a" }}>{errors.name}</Text> : null}
          <Field
            keyboardType="numeric"
            label="Card number"
            maxLength={16}
            value={payment.number}
            onChangeText={(number) => setPayment((prev) => ({ ...prev, number: number.replace(/\D/g, "").slice(0, 16) }))}
          />
          {errors.number ? <Text style={{ color: "#ff9e8a" }}>{errors.number}</Text> : null}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Field label="Expiry" maxLength={5} value={payment.expiry} onChangeText={(expiry) => setPayment((prev) => ({ ...prev, expiry }))} />
              {errors.expiry ? <Text style={{ color: "#ff9e8a" }}>{errors.expiry}</Text> : null}
            </View>
            <View style={{ flex: 1 }}>
              <Field keyboardType="numeric" label="CVV" maxLength={4} value={payment.cvv} onChangeText={(cvv) => setPayment((prev) => ({ ...prev, cvv: cvv.replace(/\D/g, "").slice(0, 4) }))} />
              {errors.cvv ? <Text style={{ color: "#ff9e8a" }}>{errors.cvv}</Text> : null}
            </View>
          </View>
          {errors.form ? <Text style={{ color: "#ff9e8a" }}>{errors.form}</Text> : null}
          <Button title={busy ? "Processing..." : `Pay Rs ${total.toFixed(2)}`} onPress={checkout} disabled={busy || !user} />
        </Card>
      </ScrollView>
    </Screen>
  );
}
