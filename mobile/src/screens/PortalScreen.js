import { useNavigation } from "@react-navigation/native";
import { ScrollView, Text, View } from "react-native";
import { Button, Card, Heading, Screen } from "../components/UI";

export function PortalScreen() {
  const navigation = useNavigation();

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 24, paddingBottom: 32, alignItems: 'center', justifyContent: 'center', minHeight: '100%' }}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ color: "#ff6b47", fontSize: 42, fontWeight: "900", letterSpacing: -1 }}>Crave Bites</Text>
          <Text style={{ color: "#d7b9aa", fontSize: 16, textAlign: "center", marginTop: 12, lineHeight: 24 }}>
            Welcome to Crave Bites! We deliver the freshest, most delicious fast food right to your doorstep. Satisfy your cravings in just a few taps.
          </Text>
        </View>
        <Card style={{ width: '100%', gap: 16 }}>
          <Button title="Login as Customer" onPress={() => navigation.navigate("CustomerLogin")} />
          <Button title="Create an Account" variant="ghost" onPress={() => navigation.navigate("CustomerRegister")} />
        </Card>
        <Card style={{ width: '100%', marginTop: 16, borderColor: 'transparent', backgroundColor: 'transparent', padding: 0 }}>
          <Button title="Staff Portal" variant="ghost" onPress={() => navigation.navigate("AdminLogin")} />
        </Card>
      </ScrollView>
    </Screen>
  );
}
