import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { MenuScreen } from "../screens/customer/MenuScreen";
import { CartScreen } from "../screens/customer/CartScreen";
import { OrdersScreen } from "../screens/customer/OrdersScreen";
import { ProfileScreen } from "../screens/customer/ProfileScreen";

const Tab = createBottomTabNavigator();

export function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#120a09" },
        headerTintColor: "#fff6f0",
        tabBarStyle: { backgroundColor: "#140c0b", borderTopColor: "rgba(255,255,255,0.08)" },
        tabBarActiveTintColor: "#ff6b47",
        tabBarInactiveTintColor: "#9f857a",
        tabBarIcon: ({ color, size }) => {
          let iconName = "ellipse";
          if (route.name === "Menu") iconName = "restaurant";
          else if (route.name === "Cart") iconName = "cart";
          else if (route.name === "Orders") iconName = "receipt";
          else if (route.name === "Profile") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
