import { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { api } from "../../api/client";
import { Button, Card, Heading, Pill, Screen } from "../../components/UI";

export function AdminFeedbackScreen() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      setItems(await api.feedback());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Heading title="Feedback" subtitle="See reviews and remove spam or outdated feedback." />
        {error ? <Text style={{ color: "#ff9e8a" }}>{error}</Text> : null}
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card>
              <Text style={{ color: "#fff6f0", fontWeight: "800" }}>Rating {item.rating} / 5</Text>
              <Text style={{ color: "#d7b9aa" }}>{item.comment || "No comment"}</Text>
              <Pill title="Customer review" />
              <Button
                title="Delete"
                variant="danger"
                onPress={async () => {
                  await api.deleteFeedback(item._id);
                  load();
                }}
              />
            </Card>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      </ScrollView>
    </Screen>
  );
}
