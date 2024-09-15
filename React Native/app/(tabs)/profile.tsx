import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, FlatList, Text, View, Button } from "react-native";
import * as Linking from "expo-linking";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AuthContext from "@/components/provider/AuthContext";
import { useContext } from "react";
import { Link } from "expo-router";
import PleaseLogin from "@/components/basic/PleaseLogin";

export default function Profile() {
  const { signOut, getUser } = useContext(AuthContext);

  if (!getUser()) {
    return <PleaseLogin />;
  }

  const onSignOut = async () => {
    signOut();
    Linking.openURL("/");
  };

  const userData: { [index: string]: { value: string; capitalize?: boolean } } =
    (() => {
      const user = getUser();
      return {
        username: { value: user?.username as string },
        name: { value: user?.username as string, capitalize: true },
        role: { value: user?.role as string, capitalize: true },
      };
    })();
  const userDataList: { label: string; value: string; capitalize?: boolean }[] =
    [];
  for (let i in userData) {
    userDataList.push({
      label: i,
      value: userData[i].value,
      capitalize: userData[i].capitalize,
    });
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#7de8b6", dark: "#1d473b" }}
      headerImage={
        <Ionicons size={310} name="person-outline" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Profile</ThemedText>
        <FlatList
          data={userDataList}
          style={styles.userContainer}
          renderItem={({ item }) => (
            <ThemedText
              style={[
                styles.userDataItem,
                item.capitalize && { textTransform: "capitalize" },
              ]}
            >
              <Text
                style={{
                  textTransform: "capitalize",
                  width: "15%",
                  display: "flex",
                }}
              >
                {item.label}
              </Text>
              {item.value}
            </ThemedText>
          )}
        />
        <Button onPress={onSignOut} title="Sign Out" />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "column",
    gap: 8,
  },
  userContainer: {
    marginVertical: 8,
  },
  userDataItem: {
    display: "flex",
    marginVertical: 2,
  },
});
