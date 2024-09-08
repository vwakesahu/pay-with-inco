import { createSlice } from "@reduxjs/toolkit";
import { erc20RulesContractAddressIntialState } from "../intialStates/erc20RulesContractAddressIntialState";

const erc20RulesContractAddressSlice = createSlice({
  name: "erc20RulesContractAddress",
  initialState: {
    erc20RulesContractAddress: erc20RulesContractAddressIntialState,
  },
  reducers: {
    setErc20RulesContractAddress: (state, action) => {
      state.erc20RulesContractAddress = action.payload;
      console.log(state.erc20RulesContractAddress);
    },
    resetErc20RulesContractAddress: (state) => {
      state.erc20RulesContractAddress = erc20RulesContractAddressIntialState;
    },
  },
});

export const { setErc20RulesContractAddress, resetErc20RulesContractAddress } =
  erc20RulesContractAddressSlice.actions;

export default erc20RulesContractAddressSlice.reducer;
