// userSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { encryptedERC20IntialState } from "../intialStates/userInitialState";

const encrytedERC20AddressSlice = createSlice({
  name: "encrytedERC20Address",
  initialState: encryptedERC20IntialState,
  reducers: {
    setEncryptedAddress: (state, action) => {
      state.encrytedERC20Addres = action.payload;
      console.log(state.encrytedERC20Address);
    },
    resetEncryptedAddress: (state) => {
      state.encrytedERC20Address = userInitialState;
    },
  },
});

export const { setEncryptedAddress, resresetEncryptedAddressetUser } =
  encrytedERC20AddressSlice.actions;

export default encrytedERC20AddressSlice.reducer;
