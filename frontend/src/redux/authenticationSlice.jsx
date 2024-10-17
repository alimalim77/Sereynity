import { createSlice } from "@reduxjs/toolkit";

const authenticationSlice = createSlice({
  name: "authenticationSlice",
  initialState: {
    value: false,
  },
  reducers: {
    trigger: (state) => {
      state.value = true;
    },
    reset: (state) => {
      state.value = false;
    },
  },
});

export const { trigger, reset } = authenticationSlice.actions;
export default authenticationSlice.reducer;
