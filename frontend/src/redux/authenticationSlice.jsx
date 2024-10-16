import { createSlice } from "@reduxjs/toolkit";

const authenticationSlice = createSlice({
  name: "authenticationSlice",
  initialState: {
    value: false,
  },
  reducers: {
    trigger: (state) => {
      state.value = !state.value;
    },
  },
});

export const { trigger } = authenticationSlice.actions;
export default authenticationSlice.reducer;
