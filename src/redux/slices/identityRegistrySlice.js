// userSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { identityRegistryIntialState } from "../intialStates/identityRegistryIntialstate";

const identityRegistryContractAddressSlice = createSlice({
  name: "identityRegistryContractAddress",
  initialState: {
    identityRegistryContractAddress: identityRegistryIntialState,
  },
  reducers: {
    setIdentityRegistryContractAddress: (state, action) => {
      state.identityRegistryContractAddress = action.payload;
      console.log(state.identityRegistryContractAddress);
    },
    resetIdentityRegistryContractAddress: (state) => {
      state.identityRegistryContractAddress = identityRegistryIntialState;
    },
  },
});

export const {
  setIdentityRegistryContractAddress,
  resetIdentityRegistryContractAddress,
} = identityRegistryContractAddressSlice.actions;

export default identityRegistryContractAddressSlice.reducer;
