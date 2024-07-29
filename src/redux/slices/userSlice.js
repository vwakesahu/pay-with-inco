// userSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { erc20ContractAddressIntialstate } from "../intialStates/userInitialState";

const addressSlice = createSlice({
  name: "erc20ContractAddress",
  initialState: erc20ContractAddressIntialstate,
  reducers: {
    setEncryptedAddress: (state, action) => {
      state.erc20ContractAddress = action.payload;
      console.log(state.erc20ContractAddress);
    },
    resetEncryptedAddress: (state) => {
      state.erc20ContractAddress = userInitialState;
    },
  },
});

export const { setEncryptedAddress, resresetEncryptedAddressetUser } =
  addressSlice.actions;

export default addressSlice.reducer;
