// userSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { defaultTokenIntialState } from "../intialStates/normalTokenAddress";

const defaultTokenAddressSlice = createSlice({
  name: "defaultTokenAddress",
  initialState: { defaultTokenAddress: defaultTokenIntialState },
  reducers: {
    setDefaultTokenAddress: (state, action) => {
      state.defaultTokenAddress = action.payload;
      console.log(state.defaultTokenAddress);
    },
    resetSetDefaultAddress: (state) => {
      state.defaultTokenAddress = defaultTokenIntialState;
    },
  },
});

export const { setDefaultTokenAddress, resetSetDefaultAddress } =
  defaultTokenAddressSlice.actions;

export default defaultTokenAddressSlice.reducer;
