import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useContext, useRef, useState } from "react";
import AuthContext from "@/components/provider/AuthContext";
import PleaseLogin from "@/components/basic/PleaseLogin";

export default function Ask() {
  const [text, onChangeText] = useState<string>();
  const [msgs, setMsgs] = useState<{ bot: boolean; msg: string }[]>([]);
  const inputRef = useRef<TextInput>(null);

  const { getUser } = useContext(AuthContext);
  if (!getUser()) {
    return <PleaseLogin />;
  }
  const user = getUser();

  const onSubmitChat = async () => {
    if (!text) return;
    setMsgs((msgs) => [{ bot: false, msg: text }, ...msgs]);
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_ServerUrl}/chat?prompt=${text}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res?.error) throw Error(res.error);
        return res.res;
      })
      .catch((e) => {
        console.log(e);
        return ["..."];
      })
      .then((res: string[]) =>
        res
          .filter((ele) => ele != "")
          .map((ele) => {
            return { bot: true, msg: ele };
          })
          .reverse()
      );
    setMsgs((msgs) => [...res, ...msgs]);
  };

  return (
    <ThemedView
      style={{
        height: "100%",
        flexDirection: "column",
        padding: 10,
      }}
    >
      <FlatList
        data={msgs}
        inverted={true}
        renderItem={({ item }) => (
          <View style={[styles.ChatItem, !item.bot && styles.ChatItemSelf]}>
            <ThemedText style={styles.ChatItemUsername}>
              -{item.bot ? "Bot" : user?.username}
            </ThemedText>
            <ThemedText style={styles.ChatItemMsg}>{item.msg}</ThemedText>
          </View>
        )}
        keyExtractor={(item, id) => id.toString()}
        style={styles.ChatContainer}
      />
      <SafeAreaView>
        <View style={styles.ChatBox}>
          <TextInput
            ref={inputRef}
            autoFocus
            enterKeyHint="send"
            style={styles.ChatBoxInput}
            onChangeText={onChangeText}
            defaultValue={text}
            onSubmitEditing={() => {
              onSubmitChat();
              inputRef.current?.clear();
              inputRef.current?.focus();
            }}
          />
          <TouchableOpacity
            onPress={onSubmitChat}
            style={styles.ChatBoxButton}
            accessibilityLabel="Send"
          >
            <Ionicons size={32} name="send" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  ChatContainer: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    flex: 1,
    gap: 4,
  },
  ChatItem: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginVertical: 2,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    alignSelf: "flex-start",
  },
  ChatItemSelf: {
    alignSelf: "flex-end",
  },
  ChatItemUsername: {
    fontSize: 12,
    lineHeight: 12,
    textTransform: "capitalize",
  },
  ChatItemMsg: {},
  ChatBox: {
    flexDirection: "row",
    padding: 4,
    paddingLeft: 0,
  },
  ChatBoxInput: {
    flex: 1,
    marginRight: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontWeight: "600",
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
  },
  ChatBoxButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: "#00000022",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
  },
});
