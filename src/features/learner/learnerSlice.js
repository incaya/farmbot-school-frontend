import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { learnerAPI } from "./learnerAPI";

export const fetchAll = createAsyncThunk(
  "learner/fetchAll",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new learnerAPI();
    api.setJwt(jwt);
    const response = await api.fetchAll();
    return response.data;
  }
);
export const fetch = createAsyncThunk(
  "learner/fetch",
  async (challengeId, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new learnerAPI();
    api.setJwt(jwt);
    const response = await api.fetch(challengeId);
    return response.data;
  }
);
export const create = createAsyncThunk(
  "learner/create",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new learnerAPI();
    api.setJwt(jwt);
    const response = await api.create(payload);
    return response.data;
  }
);
export const update = createAsyncThunk(
  "learner/update",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new learnerAPI();
    api.setJwt(jwt);
    const response = await api.update(payload);
    return response.data;
  }
);

export const learnerSlice = createSlice({
  name: "learner",
  initialState: {
    loading: "idle",
    errorMessage: null,
    list: [],
    focus: {
      id: null,
      email: "",
      pseudo: "",
      name: "",
      sequences: [],
    },
  },
  reducers: {
    changeFocusValue: (state, action) => {
      const { field, value } = action.payload;
      state.focus[field] = value;
    },
    setErrorMessage: (state, action) => {
      const { message } = action.payload;
      state.errorMessage = message;
    },
  },
  extraReducers: {
    [fetchAll.pending]: (state, action) => {
      state.loading = "pending";
    },
    [fetchAll.fulfilled]: (state, action) => {
      state.list = action.payload["users"];
      state.loading = "idle";
    },
    [fetch.pending]: (state, action) => {
      state.loading = "pending";
    },
    [fetch.fulfilled]: (state, action) => {
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
      state.errorMessage = "Impossible de créer l'apprenant";
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
      state.errorMessage = "Impossible de modifier ce profil";
    },
  },
});

export const { changeFocusValue, setErrorMessage } = learnerSlice.actions;

// Selectors
export const selectLearnerList = (state) => state.learner.list;
export const selectLearnerFocus = (state) => state.learner.focus;
export const selectLearnerFocusId = (state) => state.learner.focus.id;
export const selectLoading = (state) => state.learner.loading;
export const selectErrorMessage = (state) => state.learner.errorMessage;

export default learnerSlice.reducer;
