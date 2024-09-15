import * as React from "react";
import { authContext } from "./AuthProvider";

const defaultAuthContext: authContext = {
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  getUser: () => undefined,
};

const AuthContext = React.createContext<authContext>(defaultAuthContext);

AuthContext.displayName = "AuthContext";

export default AuthContext;
