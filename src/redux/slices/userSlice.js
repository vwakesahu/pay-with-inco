// userSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { encryptedERC20IntialState } from "../intialStates/userInitialState";

const encrytedERC20AddressSlice = createSlice({
  name: "encrytedERC20Address",
  initialState: { encrytedERC20ContractAddress: encryptedERC20IntialState },
  reducers: {
    setEncryptedAddress: (state, action) => {
      console.log(state);
      console.log(action.payload);
      state.encrytedERC20ContractAddress = action.payload;
      console.log(state.encrytedERC20ContractAddress);
    },
    resetEncryptedAddress: (state) => {
      state.encrytedERC20ContractAddress = userInitialState;
    },
  },
});

export const { setEncryptedAddress, resresetEncryptedAddressetUser } =
  encrytedERC20AddressSlice.actions;

export default encrytedERC20AddressSlice.reducer;
