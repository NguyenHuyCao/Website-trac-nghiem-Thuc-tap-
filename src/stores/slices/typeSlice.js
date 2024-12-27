// src/features/typeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const typeSlice = createSlice({
  name: "type",
  initialState: { value: "" },
  reducers: {
    setType: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setType } = typeSlice.actions;

export default typeSlice.reducer;