import { createContext } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  authId: [],
  setAuthId: () => {},
  currentUser: {},
  setCurrentUser: () => {},
});
