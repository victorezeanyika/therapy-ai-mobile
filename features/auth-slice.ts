import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "@/types";

interface AuthState {
  userId: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  accessToken: string | null;
}

const initialState: AuthState = {
  userId: null,
  user: null,
  isAuthenticated: false,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: IUser; accessToken?: string }>) => {
      state.userId = action.payload.user.entryId;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
        AsyncStorage.setItem("accessToken", action.payload.accessToken).catch(console.error);
      }

      // Save userId in AsyncStorage
      // AsyncStorage.setItem("userId", action.payload.entryId).catch(console.error);
    },
    logout: (state) => {
      state.userId = null;
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;

      // Clear storage
      AsyncStorage.removeItem("userId").catch(console.error);
      AsyncStorage.removeItem("accessToken").catch(console.error);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
