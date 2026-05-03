import { useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, Text, View } from "react-native";
import { api } from "../../api/client";
import { Button, Card, Heading, Pill, Screen } from "../../components/UI";

const STEPS = ["Pending", "Preparing", "Ready", "Delivered"];

export function AdminOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setOrders(await api.orders());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Screen>
      <Heading title="Order management" subtitle="Update order status with simple one-tap actions." />
      {error ? <Text style={{ color: "#ff9e8a" }}>{error}</Text> : null}
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#ff6b47" />}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ color: "#fff6f0", fontWeight: "800" }}>{item.orderNumber}</Text>
            <Text style={{ color: "#d7b9aa" }}>{item.items.map((it) => `${it.quantity}x ${it.menuItemName}`).join(", ")}</Text>
            <Pill title={item.status} tone={item.status === "Delivered" ? "success" : "neutral"} />
            <Text style={{ color: "#ff8d56", fontWeight: "800" }}>Rs {Number(item.totalAmount).toFixed(2)}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {STEPS.map((step) => (
                <Button
                  key={step}
                  title={step}
                  variant={item.status === step ? "primary" : "ghost"}
                  onPress={async () => {
                    await api.updateOrderStatus(item._id, step);
                    load();
                  }}
                />
              ))}
            </View>
            <View style={{ marginTop: 12 }}>
              <Button
                title="Delete Order"
                variant="ghost"
                onPress={() => {
                  Alert.alert("Delete Order", `Are you sure you want to delete order ${item.orderNumber}?`, [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          await api.deleteOrder(item._id);
                          load();
                        } catch (err) {
                          Alert.alert("Error", err.message);
                        }
                      }
                    }
                  ]);
                }}
              />
            </View>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </Screen>
  );
}
