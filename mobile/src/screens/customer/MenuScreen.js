import { useEffect, useMemo, useState } from "react";
import { FlatList, Image, Pressable, RefreshControl, Text, View } from "react-native";
import { api } from "../../api/client";
import { Button, Card, Heading, Screen, Pill } from "../../components/UI";
import { useCart } from "../../context/CartContext";
import { resolveMediaUrl } from "../../utils/media";

export function MenuScreen() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const { addItem } = useCart();

  const loadMenu = async () => {
    setLoading(true);
    setError("");
    try {
      setMenu(await api.menu());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const visible = useMemo(() => menu.filter((item) => item.available), [menu]);
  const categories = useMemo(() => ["all", ...new Set(visible.map((item) => item.category || "other"))], [visible]);
  const list = filter === "all" ? visible : visible.filter((item) => item.category === filter);

  return (
    <Screen>
      <Heading title="Menu" subtitle="Fresh Colombo-style fast food with live stock and simple ordering." />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setFilter(cat)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 999,
              backgroundColor: filter === cat ? "#ff6b47" : "#241916"
            }}
          >
            <Text style={{ color: "#fff6f0", fontWeight: "700", textTransform: "capitalize" }}>{cat}</Text>
          </Pressable>
        ))}
      </View>
      {error ? <Text style={{ color: "#ff9e8a" }}>{error}</Text> : null}
      <FlatList
        data={list}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadMenu} tintColor="#ff6b47" />}
        renderItem={({ item }) => (
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <Image
              source={{ uri: resolveMediaUrl(item.imageUrl) || "https://via.placeholder.com/640x420?text=Menu+Item" }}
              style={{ width: "100%", height: 190, backgroundColor: "#241916" }}
            />
            <View style={{ padding: 16, gap: 10 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                <Text style={{ color: "#fff6f0", fontSize: 18, fontWeight: "800", flex: 1 }}>{item.name}</Text>
                <Pill title={item.stock > 5 ? `Stock ${item.stock}` : `Low ${item.stock}`} tone={item.stock > 5 ? "success" : "danger"} />
              </View>
              <Text style={{ color: "#d7b9aa" }}>{item.description || "Freshly prepared fast food."}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: "#ff8d56", fontSize: 18, fontWeight: "800" }}>Rs {Number(item.price).toFixed(2)}</Text>
                <Button title="Add" onPress={() => addItem(item)} />
              </View>
            </View>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListFooterComponent={<View style={{ height: 24 }} />}
      />
    </Screen>
  );
}
