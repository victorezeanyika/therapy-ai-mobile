import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "@/types";

interface AuthState {
  userId: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userId: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: IUser }>) => {
      state.userId = action.payload.user._id; // ✅ Store only `id`
      state.user = action.payload.user;
      state.isAuthenticated = true;

      // Save `userId` in AsyncStorage
      AsyncStorage.setItem("userId", action.payload.user._id).catch(console.error);
    },
    logout: (state) => {
      state.userId = null;
      state.user = null;
      state.isAuthenticated = false;

      AsyncStorage.removeItem("userId").catch(console.error);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
