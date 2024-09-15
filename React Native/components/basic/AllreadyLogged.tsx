import { View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { Link } from "expo-router";

export default function AllreadyLogged() {
  return (
    <ThemedView style={{ height: "100%" }}>
      <View style={{ margin: "auto" }}>
        <ThemedText style={{ fontSize: 24, fontWeight: "600" }}>
          Allready Logged In!
        </ThemedText>
        <Link href="/" style={{ textAlign: "center", marginVertical: 16 }}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}
