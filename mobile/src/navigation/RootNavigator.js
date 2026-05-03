import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { isAdminRole } from "../utils/roles";
import { PortalScreen } from "../screens/PortalScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { CustomerTabs } from "./CustomerTabs";
import { AdminTabs } from "./AdminTabs";

const Stack = createNativeStackNavigator();

function BootScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#100908" }}>
      <ActivityIndicator color="#ff6b47" />
    </View>
  );
}

export function RootNavigator() {
  const { ready, user } = useAuth();

  if (!ready) {
    return <BootScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Portal" component={PortalScreen} />
          <Stack.Screen name="CustomerLogin" component={LoginScreen} initialParams={{ mode: "customer" }} />
          <Stack.Screen name="CustomerRegister" component={RegisterScreen} />
          <Stack.Screen name="AdminLogin" component={LoginScreen} initialParams={{ mode: "admin" }} />
        </>
      ) : isAdminRole(user.role) ? (
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
      ) : (
        <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
      )}
    </Stack.Navigator>
  );
}
