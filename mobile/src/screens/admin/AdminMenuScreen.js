import * as ImagePicker from "expo-image-picker";
import { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Image, Pressable, ScrollView, Text, View } from "react-native";
import { api } from "../../api/client";
import { Button, Card, Field, Heading, Pill, Screen } from "../../components/UI";
import { resolveMediaUrl } from "../../utils/media";

const emptyForm = {
  id: "",
  name: "",
  price: "",
  stock: "",
  category: "",
  description: "",
  imageUrl: "",
  imageFile: null,
  available: true
};

export function AdminMenuScreen() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
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
    load();
  }, []);

  const preview = useMemo(() => {
    if (form.imageFile?.uri) return form.imageFile.uri;
    return resolveMediaUrl(form.imageUrl) || "https://via.placeholder.com/640x420?text=Menu+Item";
  }, [form.imageFile, form.imageUrl]);

  const chooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setForm((prev) => ({ ...prev, imageFile: asset, imageUrl: "" }));
    }
  };

  const save = async () => {
    if (!form.name.trim()) return setError("Item name is required.");
    if (Number(form.price) < 0 || form.price === "") return setError("Price is required.");
    if (Number(form.stock) < 0 || form.stock === "") return setError("Stock is required.");
    if (!form.category.trim()) return setError("Category is required.");

    setSaving(true);
    setError("");
    try {
      const data = new FormData();
      data.append("id", form.id);
      data.append("name", form.name);
      data.append("price", String(form.price));
      data.append("stock", String(form.stock));
      data.append("category", form.category);
      data.append("description", form.description);
      data.append("available", String(form.available));
      if (form.imageUrl) data.append("imageUrl", form.imageUrl);
      if (form.imageFile?.uri) {
        const fileName = form.imageFile.fileName || `menu-${Date.now()}.jpg`;
        data.append("imageFile", {
          uri: form.imageFile.uri,
          name: fileName,
          type: form.imageFile.mimeType || "image/jpeg"
        });
      }

      await api.saveMenu(data);
      setNotice(form.id ? "Menu item updated." : "Menu item created.");
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const editItem = (item) => {
    setForm({
      id: item._id,
      name: item.name || "",
      price: String(item.price ?? ""),
      stock: String(item.stock ?? ""),
      category: item.category || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      imageFile: null,
      available: Boolean(item.available)
    });
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 24 }}>
        <Heading title="Menu management" subtitle="Add, edit, hide, and delete menu items with image upload support." />
        {error ? <Text style={{ color: "#ff9e8a" }}>{error}</Text> : null}
        {notice ? <Text style={{ color: "#7ef0a5" }}>{notice}</Text> : null}
        <Card style={{ gap: 12 }}>
          <Image
            source={{ uri: preview }}
            style={{ width: "100%", height: 200, borderRadius: 18, backgroundColor: "#241916" }}
          />
          <Field label="Item name" value={form.name} onChangeText={(name) => setForm((prev) => ({ ...prev, name }))} />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Field label="Price" keyboardType="numeric" value={form.price} onChangeText={(price) => setForm((prev) => ({ ...prev, price }))} />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Stock" keyboardType="numeric" value={form.stock} onChangeText={(stock) => setForm((prev) => ({ ...prev, stock }))} />
            </View>
          </View>
          <Field label="Category" value={form.category} onChangeText={(category) => setForm((prev) => ({ ...prev, category }))} />
          <Field label="Description" multiline numberOfLines={4} value={form.description} onChangeText={(description) => setForm((prev) => ({ ...prev, description }))} />
          <Field label="Image URL (optional)" value={form.imageUrl} onChangeText={(imageUrl) => setForm((prev) => ({ ...prev, imageUrl, imageFile: null }))} />
          <Button title="Choose photo" variant="ghost" onPress={chooseImage} />
          {form.imageFile ? <Text style={{ color: "#d7b9aa" }}>Selected: {form.imageFile.fileName || "photo"}</Text> : null}
          <Pressable
            onPress={() => setForm((prev) => ({ ...prev, available: !prev.available }))}
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <Text style={{ color: "#fff6f0" }}>Available</Text>
            <Pill title={form.available ? "Yes" : "Hidden"} tone={form.available ? "success" : "danger"} />
          </Pressable>
          <Button title={saving ? "Saving..." : "Save item"} onPress={save} disabled={saving} />
          {form.id ? <Button title="Cancel edit" variant="ghost" onPress={() => setForm(emptyForm)} /> : null}
        </Card>

        <FlatList
          data={menu}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <Image
                source={{ uri: resolveMediaUrl(item.imageUrl) || "https://via.placeholder.com/640x420?text=Menu+Item" }}
                style={{ width: "100%", height: 160, backgroundColor: "#241916" }}
              />
              <View style={{ padding: 14, gap: 10 }}>
                <Text style={{ color: "#fff6f0", fontSize: 18, fontWeight: "800" }}>{item.name}</Text>
                <Text style={{ color: "#d7b9aa" }}>{item.category} - Rs {Number(item.price).toFixed(2)}</Text>
                <Pill title={item.available ? "Active" : "Hidden"} tone={item.available ? "success" : "danger"} />
                <View style={{ gap: 8 }}>
                  <Button title="Edit" variant="ghost" onPress={() => editItem(item)} />
                  <Button
                    title={item.available ? "Hide" : "Show"}
                    variant="ghost"
                    onPress={async () => {
                      await api.updateMenuAvailability(item._id);
                      setNotice("Menu availability updated.");
                      load();
                    }}
                  />
                  <Button
                    title="Delete"
                    variant="danger"
                    onPress={() =>
                      Alert.alert("Delete menu item", "This action cannot be undone.", [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: async () => {
                            await api.deleteMenu(item._id);
                            setNotice("Menu item deleted.");
                            load();
                          }
                        }
                      ])
                    }
                  />
                </View>
              </View>
            </Card>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      </ScrollView>
    </Screen>
  );
}
