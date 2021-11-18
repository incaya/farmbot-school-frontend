import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { usergroupAPI } from "./usergroupAPI";

export const fetchAll = createAsyncThunk(
  "usergroup/fetchAll",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new usergroupAPI();
    api.setJwt(jwt);
    const response = await api.fetchAll();
    return response.data;
  }
);
export const fetch = createAsyncThunk(
  "usergroup/fetch",
  async (usergroupId, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new usergroupAPI();
    api.setJwt(jwt);
    const response = await api.fetch(usergroupId);
    return response.data;
  }
);
export const create = createAsyncThunk(
  "usergroup/create",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new usergroupAPI();
    api.setJwt(jwt);
    const response = await api.create(payload);
    return response.data;
  }
);
export const update = createAsyncThunk(
  "usergroup/update",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new usergroupAPI();
    api.setJwt(jwt);
    const response = await api.update(payload);
    return response.data;
  }
);

export const usergroupSlice = createSlice({
  name: "usergroup",
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
      state.list = action.payload["usergroups"];
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
      state.errorMessage = "Impossible de créer le groupe";
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
      state.errorMessage = "Impossible de modifier ce groupe";
    },
  },
});

export const { changeFocusValue, setErrorMessage } = usergroupSlice.actions;

// Selectors
export const selectUsergroupList = (state) => state.usergroup.list;
export const selectUsergroupFocus = (state) => state.usergroup.focus;
export const selectUsergroupLearners = (state) => state.usergroup.focus.users;
export const selectUsergroupChallenges = (state) => state.usergroup.focus.challenges;
export const selectUsergroupFocusId = (state) => state.usergroup.focus.id;
export const selectLoading = (state) => state.usergroup.loading;
export const selectErrorMessage = (state) => state.usergroup.errorMessage;

export default usergroupSlice.reducer;
