import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export function Screen({ children, style }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Heading({ title, subtitle }) {
  return (
    <View style={styles.headingWrap}>
      <Text style={styles.eyebrow}>Crave Bites</Text>
      <Text style={styles.heading}>{title}</Text>
      {subtitle ? <Text style={styles.subheading}>{subtitle}</Text> : null}
    </View>
  );
}

export function Field({ label, error, ...props }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor="#866e66" style={styles.input} {...props} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export function Button({ title, onPress, variant = "primary", disabled = false, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === "ghost" && styles.ghostButton,
        variant === "danger" && styles.dangerButton,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style
      ]}
    >
      <Text style={[styles.buttonText, variant !== "primary" && styles.buttonTextAlt]}>{title}</Text>
    </Pressable>
  );
}

export function Pill({ title, tone = "neutral" }) {
  return <Text style={[styles.pill, tone === "success" && styles.pillSuccess, tone === "danger" && styles.pillDanger]}>{title}</Text>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#100908", padding: 16, gap: 16 },
  card: {
    backgroundColor: "#1a1210",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 12
  },
  headingWrap: { gap: 6, marginBottom: 4 },
  eyebrow: { color: "#ff8d56", textTransform: "uppercase", letterSpacing: 1.2, fontSize: 12, fontWeight: "700" },
  heading: { color: "#fff6f0", fontSize: 30, fontWeight: "800", lineHeight: 34 },
  subheading: { color: "#d7b9aa", fontSize: 14, lineHeight: 20 },
  fieldWrap: { gap: 6 },
  label: { color: "#f2d5c6", fontSize: 13, fontWeight: "600" },
  input: {
    backgroundColor: "#241916",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff6f0"
  },
  error: { color: "#ff9e8a", fontSize: 12 },
  button: {
    backgroundColor: "#ff6b47",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center"
  },
  ghostButton: { backgroundColor: "#241916" },
  dangerButton: { backgroundColor: "rgba(204, 67, 50, 0.22)" },
  buttonText: { color: "#1b110f", fontWeight: "800", fontSize: 15 },
  buttonTextAlt: { color: "#fff6f0" },
  pressed: { transform: [{ scale: 0.99 }], opacity: 0.9 },
  disabled: { opacity: 0.6 },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#f4e0d7",
    fontWeight: "700",
    fontSize: 12
  },
  pillSuccess: { backgroundColor: "rgba(31, 180, 102, 0.18)", color: "#7ef0a5" },
  pillDanger: { backgroundColor: "rgba(224, 82, 70, 0.18)", color: "#ffb2a8" }
});
