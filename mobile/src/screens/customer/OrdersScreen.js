import { useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView, Text, View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../api/client";
import { Button, Card, Heading, Pill, Screen, Field } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";
import { requiredText } from "../../utils/validators";

export function OrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editAddressValue, setEditAddressValue] = useState("");
  const [feedbackOrder, setFeedbackOrder] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 5, comment: "" });

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

  const handleCancel = async (order) => {
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            await api.cancelOrder(order._id);
            load();
          } catch (err) {
            Alert.alert("Error", err.message);
          }
        }
      }
    ]);
  };

  const handleSaveAddress = async (order) => {
    try {
      await api.updateOrderAddress(order._id, editAddressValue);
      setEditingAddressId(null);
      load();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const submitFeedback = async (order) => {
    if (!requiredText(feedback.comment, 3)) return Alert.alert("Error", "Please enter a comment.");
    
    try {
      const results = await Promise.allSettled(
        order.items.map((item) => 
          api.submitFeedback({
            menuItemId: item.menuItemId,
            rating: feedback.rating,
            comment: feedback.comment
          })
        )
      );
      
      const rejected = results.find((result) => result.status === "rejected");
      if (rejected) {
        throw rejected.reason;
      }
      
      Alert.alert("Success", "Thank you for your feedback!");
      setFeedbackOrder(null);
      setFeedback({ rating: 5, comment: "" });
    } catch(err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#ff6b47" />}>
        <Heading title="Orders" subtitle="Your live order history and status tracking." />
        {error ? <Text style={{ color: "#ff9e8a" }}>{error}</Text> : null}
        {orders.map((order) => (
          <Card key={order._id}>
            <Text style={{ color: "#fff6f0", fontWeight: "800" }}>{order.orderNumber}</Text>
            <Text style={{ color: "#d7b9aa" }}>{order.items.map((item) => `${item.quantity}x ${item.menuItemName}`).join(", ")}</Text>
            
            {editingAddressId === order._id ? (
              <View style={{ gap: 8, marginTop: 8 }}>
                <TextInput
                  style={{ backgroundColor: "#100908", color: "#fff", padding: 12, borderRadius: 8, borderColor: "rgba(255,255,255,0.08)", borderWidth: 1 }}
                  value={editAddressValue}
                  onChangeText={setEditAddressValue}
                />
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={{ flex: 1 }}><Button title="Save" onPress={() => handleSaveAddress(order)} /></View>
                  <View style={{ flex: 1 }}><Button title="Cancel" variant="ghost" onPress={() => setEditingAddressId(null)} /></View>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <Text style={{ color: "#d7b9aa", flex: 1 }}>{order.deliveryAddress || "No address"}</Text>
                {order.status !== "Delivered" && order.status !== "Cancelled" && (
                  <Text 
                    style={{ color: "#ff6b47", paddingHorizontal: 8, fontWeight: "bold" }}
                    onPress={() => {
                      setEditAddressValue(order.deliveryAddress || "");
                      setEditingAddressId(order._id);
                    }}
                  >
                    Edit
                  </Text>
                )}
              </View>
            )}

            {order.status !== "Cancelled" ? (
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16, marginBottom: 8 }}>
                {["Pending", "Preparing", "Ready", "Delivered"].map((step, index) => {
                  const isActive = ["Pending", "Preparing", "Ready", "Delivered"].indexOf(order.status) >= index;
                  return (
                    <View key={step} style={{ flex: 1, alignItems: "center", gap: 4 }}>
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: isActive ? "#7ef0a5" : "#3e2f2a" }} />
                      <Text style={{ color: isActive ? "#7ef0a5" : "#866e66", fontSize: 10, fontWeight: "700", textAlign: "center" }}>{step}</Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Pill title="Cancelled" tone="danger" />
            )}
            
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <Text style={{ color: "#ff8d56", fontWeight: "800", fontSize: 16 }}>Rs {Number(order.totalAmount).toFixed(2)}</Text>
              {order.status === "Pending" && (
                <Text 
                  style={{ color: "#ff4c4c", fontWeight: "bold" }}
                  onPress={() => handleCancel(order)}
                >
                  Cancel Order
                </Text>
              )}
            </View>

            {order.status === "Delivered" && (
              <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)", paddingTop: 16 }}>
                {feedbackOrder === order._id ? (
                  <View style={{ gap: 12 }}>
                    <Text style={{ color: "#fff6f0", fontWeight: "700" }}>Rate your order</Text>
                    <View style={{ flexDirection: "row", gap: 8, justifyContent: "center" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons 
                          key={star}
                          name={star <= feedback.rating ? "star" : "star-outline"} 
                          size={32} 
                          color="#ff8d56" 
                          onPress={() => setFeedback(prev => ({ ...prev, rating: star }))}
                        />
                      ))}
                    </View>
                    <Field label="Comment" value={feedback.comment} multiline numberOfLines={2} onChangeText={(comment) => setFeedback((prev) => ({ ...prev, comment }))} />
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <View style={{ flex: 1 }}><Button title="Submit" onPress={() => submitFeedback(order)} /></View>
                      <View style={{ flex: 1 }}><Button title="Cancel" variant="ghost" onPress={() => setFeedbackOrder(null)} /></View>
                    </View>
                  </View>
                ) : (
                  <Button title="Leave Feedback" variant="ghost" onPress={() => {
                    setFeedbackOrder(order._id);
                    setFeedback({ rating: 5, comment: "" });
                  }} />
                )}
              </View>
            )}
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
