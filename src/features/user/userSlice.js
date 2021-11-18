import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userAPI } from "./userAPI";
import jwt_decode from "jwt-decode";

export const login = createAsyncThunk(
  "user/login",
  async (payload, thunkAPI) => {
    const response = await userAPI.login(payload.email, payload.password);
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: "idle",
    token: null,
    role: null,
    name: null,
    errorMessage: null,
    data: [],
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.role = null;
      state.name = null;
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.loading = "pending";
    },
    [login.fulfilled]: (state, action) => {
      let jwt = action.payload["access_token"];
      state.token = jwt;
      let decodedJwt = jwt_decode(jwt);
      state.role = decodedJwt["user_claims"].role;
      state.name = decodedJwt["user_claims"].name;
      state.loading = "idle";
      state.errorMessage = null;
    },
    [login.rejected]: (state, action) => {
      state.token = null;
      state.loading = "idle";
      state.errorMessage = "Email ou mot de passe incorrect(s)";
    },
  },
});

export const { logout, loginLoading, loginReceived } = userSlice.actions;

export const selectUserToken = (state) => state.user.token;
export const selectUserRole = (state) => state.user.role;
export const selectUserName = (state) => state.user.name;
export const selectLoading = (state) => state.user.loading;
export const selectErrorMessage = (state) => state.user.errorMessage;
export const hasToken = (state) => state.user.token !== null;
export const tokenValid = (state) => {
  if (!state.user.token) {
    return false;
  }
  let decodedJwt = jwt_decode(state.user.token);
  let now = Math.floor(Date.now() / 1000);
  let isValid = now < decodedJwt.exp;
  return isValid;
};



export default userSlice.reducer;
