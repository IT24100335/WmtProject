import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { AdminDashboardScreen } from "../screens/admin/AdminDashboardScreen";
import { AdminMenuScreen } from "../screens/admin/AdminMenuScreen";
import { AdminOrdersScreen } from "../screens/admin/AdminOrdersScreen";
import { AdminPromotionsScreen } from "../screens/admin/AdminPromotionsScreen";
import { AdminInventoryScreen } from "../screens/admin/AdminInventoryScreen";
import { AdminFeedbackScreen } from "../screens/admin/AdminFeedbackScreen";
import { AdminUsersScreen } from "../screens/admin/AdminUsersScreen";
import { getAllowedAdminTabs } from "../utils/adminAccess";

const Tab = createBottomTabNavigator();

export function AdminTabs() {
  const { user } = useAuth();
  const allowed = getAllowedAdminTabs(user?.role);
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
          if (route.name === "Overview") iconName = "stats-chart";
          else if (route.name === "Menu") iconName = "restaurant";
          else if (route.name === "Orders") iconName = "receipt";
          else if (route.name === "Promos") iconName = "pricetag";
          else if (route.name === "Inventory") iconName = "cube";
          else if (route.name === "Feedback") iconName = "chatbubbles";
          else if (route.name === "Users") iconName = "people";
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      {allowed.includes("Overview") ? <Tab.Screen name="Overview" component={AdminDashboardScreen} /> : null}
      {allowed.includes("Menu") ? <Tab.Screen name="Menu" component={AdminMenuScreen} /> : null}
      {allowed.includes("Orders") ? <Tab.Screen name="Orders" component={AdminOrdersScreen} /> : null}
      {allowed.includes("Promos") ? <Tab.Screen name="Promos" component={AdminPromotionsScreen} /> : null}
      {allowed.includes("Inventory") ? <Tab.Screen name="Inventory" component={AdminInventoryScreen} /> : null}
      {allowed.includes("Feedback") ? <Tab.Screen name="Feedback" component={AdminFeedbackScreen} /> : null}
      {allowed.includes("Users") ? <Tab.Screen name="Users" component={AdminUsersScreen} /> : null}
    </Tab.Navigator>
  );
}
