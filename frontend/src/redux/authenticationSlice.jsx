import { createSlice } from "@reduxjs/toolkit";

const authenticationSlice = createSlice({
  name: "authenticationSlice",
  initialState: {
    value: false,
  },
  reducers: {
    trigger: (state, action) => {
      state.value = action.payload;
    },
    reset: (state) => {
      state.value = false;
    },
  },
});

export const { trigger, reset } = authenticationSlice.actions;
export default authenticationSlice.reducer;
