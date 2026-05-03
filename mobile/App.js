import "react-native-gesture-handler";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

enableScreens();

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#100908",
    card: "#1a1210",
    text: "#fff6f0",
    border: "rgba(255,255,255,0.08)",
    primary: "#ff6b47"
  }
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer theme={theme}>
            <RootNavigator />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
