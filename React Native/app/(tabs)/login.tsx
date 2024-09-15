import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  TextInput,
  Button,
  View,
  Dimensions,
  ToastAndroid,
  Platform,
} from "react-native";
import * as Linking from "expo-linking";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useContext, useRef, useState } from "react";
import { Link } from "expo-router";
import AuthContext from "@/components/provider/AuthContext";
import AllreadyLogged from "@/components/basic/AllreadyLogged";

export default function Login() {
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const { signIn, getUser } = useContext(AuthContext);

  if (getUser()) {
    return <AllreadyLogged />;
  }

  Dimensions.addEventListener("change", ({ window }) => {
    setWindowWidth(window.width);
  });

  const onSubmitLogin = async () => {
    try {
      await signIn({ username, password });
    } catch (e: any) {
      console.log(e.message);
      if (Platform.OS == "android")
        ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
    Linking.openURL("/");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#7de8a6", dark: "#09341a" }}
      headerImage={
        <Ionicons size={310} name="star" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Login</ThemedText>
      </ThemedView>
      <ThemedView
        style={[
          styles.MenuContainer,
          {
            width: windowWidth >= 360 ? "40%" : "auto",
          },
        ]}
      >
        <View style={styles.MenuItem}>
          <ThemedText style={styles.MenuItemLabel}>Username</ThemedText>
          <TextInput
            ref={usernameRef}
            editable
            maxLength={40}
            onChangeText={setUsername}
            defaultValue={username}
            onSubmitEditing={() => {
              passwordRef.current?.focus();
            }}
            style={styles.MenuItemInput}
          />
        </View>
        <View style={styles.MenuItem}>
          <ThemedText style={styles.MenuItemLabel}>Password</ThemedText>
          <TextInput
            ref={passwordRef}
            editable
            maxLength={40}
            onChangeText={setPassword}
            defaultValue={password}
            onSubmitEditing={onSubmitLogin}
            style={styles.MenuItemInput}
          />
        </View>
        <Button onPress={onSubmitLogin} title="Login" />
      </ThemedView>
      <ThemedText>
        Don't have an account?
        <Link style={styles.MenuLink} href="/(tabs)/signup">
          <ThemedText type="link">SignUp Here!</ThemedText>
        </Link>
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#08913c99",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  MenuContainer: {
    flexDirection: "column",
    marginVertical: 16,
    gap: 16,
  },
  MenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  MenuItemLabel: {
    flex: 0.3,
  },
  MenuItemInput: {
    flex: 1,
    fontWeight: "600",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 4,
  },
  MenuLink: {
    paddingHorizontal: 4,
  },
});
