import * as React from "react";
import AuthContext from "./AuthContext";
import { User } from "../interface/User";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export interface Auth {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
  user?: User;
}

const DefaultAuth: Auth = {
  isLoading: true,
  isSignout: false,
  userToken: null,
};

type Props = {
  children: React.ReactNode;
};

export interface authContext {
  signIn: (data: { username: string; password: string }) => Promise<void>;
  signOut: VoidFunction;
  signUp: (data: { username: string; password: string }) => Promise<void>;
  getUser: () => User | undefined;
}

export default function AuthProvider({ children }: Props) {
  const [state, dispatch]: [Auth, (action: any) => void] = React.useReducer<
    (prevState: Auth, action: any) => any
  >((prevState, action) => {
    switch (action.type) {
      case "RESTORE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          user: action.user,
          isLoading: false,
        };
      case "SIGN_IN":
        return {
          ...prevState,
          isSignout: false,
          userToken: action.token,
          user: action.user,
        };
      case "SIGN_OUT":
        return {
          ...prevState,
          isSignout: true,
          userToken: null,
          user: null,
        };
    }
  }, DefaultAuth);

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      let user;

      try {
        userToken =
          Platform.OS == "web"
            ? window.localStorage.getItem("userToken")
            : await SecureStore.getItemAsync("userToken");
        user = JSON.parse(
          (Platform.OS == "web"
            ? window.localStorage.getItem("user")
            : await SecureStore.getItemAsync("user")) as string
        );
        if (user == null) return;

        await fetch(
          `${process.env.EXPO_PUBLIC_ServerUrl}/user/login?username=${user.username}&password=${user.password}`
        )
          .then((res) => res.json())
          .then((res) => {
            if (res?.error) throw Error(res.error);
          });
      } catch (e) {
        console.log(e);
        return;
      }

      dispatch({
        type: "RESTORE_TOKEN",
        token: userToken,
        user: user,
      });
    };

    bootstrapAsync();
  }, []);

  const authContext: authContext = {
    signIn: async (data: { username: string; password: string }) => {
      data.username = data.username.toLowerCase();
      const user = await fetch(
        `${process.env.EXPO_PUBLIC_ServerUrl}/user/login?username=${data.username}&password=${data.password}`
      )
        .then((res) => res.json())
        .then((res) => {
          if (res?.error) throw Error(res.error);
          return res.user;
        });

      Platform.OS == "web"
        ? window.localStorage.setItem("user", JSON.stringify(user))
        : SecureStore.setItemAsync("user", JSON.stringify(user)).catch((err) =>
            console.log(err)
          );

      dispatch({
        type: "SIGN_IN",
        token: "dummy-auth-token",
        user: user,
      });
    },
    signOut: () => {
      Platform.OS == "web"
        ? (window.localStorage.removeItem("user"),
          window.localStorage.removeItem("userToken"))
        : (SecureStore.deleteItemAsync("user").catch((err) => console.log(err)),
          SecureStore.deleteItemAsync("userToken").catch((err) =>
            console.log(err)
          ));

      dispatch({ type: "SIGN_OUT" });
    },
    signUp: async (data: { username: string; password: string }) => {
      data.username = data.username.toLowerCase();
      const user = await fetch(
        `${process.env.EXPO_PUBLIC_ServerUrl}/user/signup?username=${data.username}&password=${data.password}`
      )
        .then((res) => res.json())
        .then((res) => {
          if (res?.error) throw Error(res.error);
          return res.user;
        });

      Platform.OS == "web"
        ? window.localStorage.setItem("user", JSON.stringify(user))
        : SecureStore.setItemAsync("user", JSON.stringify(user)).catch((err) =>
            console.log(err)
          );

      dispatch({
        type: "SIGN_IN",
        token: "dummy-auth-token",
        user: user,
      });
    },
    getUser: () => state.user,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}
