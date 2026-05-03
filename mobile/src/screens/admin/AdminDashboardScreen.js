import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { api } from "../../api/client";
import { Button, Card, Heading, Pill, Screen } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";

export function AdminDashboardScreen() {
  const { logout } = useAuth();
  const [data, setData] = useState({ menu: [], orders: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [menu, orders] = await Promise.all([
          api.menu(),
          api.orders()
        ]);
        setData({ menu, orders });
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todaysOrders = data.orders.filter((order) => String(order.orderTime || "").slice(0, 10) === todayKey);
  const pendingOrders = data.orders.filter((order) => order.status === "Pending").length;
  const lowStockCount = data.menu.filter((item) => item.stock <= 5).length;
  const revenue = todaysOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  const latestOrders = [...data.orders].reverse().slice(0, 5);

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}>
        <Heading title="Admin overview" subtitle="Quick counts and module access for the back office." />
        {error ? <Text style={{ color: "#ff9e8a" }}>{error}</Text> : null}
        
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {[
            ["Today's orders", todaysOrders.length],
            ["Pending orders", pendingOrders],
            ["Revenue", `Rs ${revenue.toFixed(2)}`],
            ["Low stock", lowStockCount]
          ].map(([label, value]) => (
            <Card key={label} style={{ width: "48%", minWidth: 150 }}>
              <Text style={{ color: "#d7b9aa" }}>{label}</Text>
              <Text style={{ color: "#fff6f0", fontSize: 24, fontWeight: "800" }}>{value}</Text>
            </Card>
          ))}
        </View>

        <Heading title="Latest orders" />
        {latestOrders.length === 0 ? (
          <Text style={{ color: "#d7b9aa" }}>No orders yet.</Text>
        ) : null}
        {latestOrders.map(order => (
          <Card key={order._id}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: "#fff6f0", fontWeight: "800" }}>{order.orderNumber}</Text>
              <Text style={{ color: "#ff8d56", fontWeight: "700" }}>Rs {Number(order.totalAmount).toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
              <Text style={{ color: "#d7b9aa", flex: 1 }}>{order.items.map((item) => `${item.quantity}x ${item.menuItemName}`).join(", ")}</Text>
              <View style={{ marginLeft: 8 }}><Pill title={order.status} tone={order.status === "Delivered" ? "success" : order.status === "Cancelled" ? "danger" : "neutral"} /></View>
            </View>
          </Card>
        ))}

        <View style={{ marginTop: 24 }}>
          <Button title="Log Out" variant="danger" onPress={logout} />
        </View>
      </ScrollView>
    </Screen>
  );
}
