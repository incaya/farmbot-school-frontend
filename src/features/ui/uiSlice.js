import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    toSnack: null,
  },
  reducers: {
    clearSnack: (state, action) => {
      state.toSnack = null;
    },
    addSnack: (state, action) => {
      state.toSnack = {
        message: action.payload.message,
        type: action.payload.type,
      };
    },
  },
});

export const { clearSnack, addSnack } = uiSlice.actions;

// Selectors
export const selectToSnack = (state) => state.ui.toSnack;

export default uiSlice.reducer;
