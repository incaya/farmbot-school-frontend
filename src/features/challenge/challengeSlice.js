import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { challengeAPI } from "./challengeAPI";

export const fetchAll = createAsyncThunk(
  "challenge/fetchAll",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new challengeAPI();
    api.setJwt(jwt);
    const response = await api.fetchAll();
    return response.data;
  }
);
export const fetch = createAsyncThunk(
  "challenge/fetch",
  async (challengeId, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new challengeAPI();
    api.setJwt(jwt);
    const response = await api.fetch(challengeId);
    return response.data;
  }
);
export const create = createAsyncThunk(
  "challenge/create",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new challengeAPI();
    api.setJwt(jwt);
    const response = await api.create(payload);
    return response.data;
  }
);
export const update = createAsyncThunk(
  "challenge/update",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new challengeAPI();
    api.setJwt(jwt);
    const response = await api.update(payload);
    return response.data;
  }
);

export const challengeSlice = createSlice({
  name: "challenge",
  initialState: {
    loading: "idle",
    errorMessage: null,
    list: [],
    focus: {
      id: null,
      active: false,
      endDate: "",
      title: "",
      description: "",
    },
  },
  reducers: {
    changeFocusValue: (state, action) => {
      const { field, value } = action.payload;
      state.focus[field] = value;
    },
  },
  extraReducers: {
    [fetchAll.pending]: (state, action) => {
      state.loading = "pending";
    },
    [fetchAll.fulfilled]: (state, action) => {
      state.list = action.payload["challenges"];
      state.loading = "idle";
    },
    [fetch.pending]: (state, action) => {
      state.loading = "pending";
    },
    [fetch.fulfilled]: (state, action) => {
      action.payload.description =
        action.payload.description === null ? "" : action.payload.description;
      state.focus = { ...state.focus, ...action.payload };
      state.loading = "idle";
    },
    [create.pending]: (state, action) => {
      state.loading = "pending";
    },
    [create.fulfilled]: (state, action) => {
      state.loading = "idle";
      state.errorMessage = null;
    },
    [create.rejected]: (state, action) => {
      state.loading = "idle";
      state.errorMessage = "Impossible de créer ce défi";
    },
    [update.pending]: (state, action) => {
      state.loading = "pending";
    },
    [update.fulfilled]: (state, action) => {
      state.loading = "idle";
      state.errorMessage = null;
    },
    [update.rejected]: (state, action) => {
      state.loading = "idle";
      state.errorMessage = "Impossible de modifier ce défi";
    },
  },
});

export const { changeFocusValue } = challengeSlice.actions;

// Selectors
export const selectChallengeList = (state) => state.challenge.list;
export const selectChallengeFocus = (state) => state.challenge.focus;
export const selectChallengeFocusId = (state) => state.challenge.focus.id;
export const selectLoading = (state) => state.challenge.loading;
export const selectErrorMessage = (state) => state.challenge.errorMessage;

export default challengeSlice.reducer;
