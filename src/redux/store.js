// store.js
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import encrytedERC20AddressReducer from "./slices/userSlice";
import defaultTokenAddressReducer from "./slices/normalERCSlice";
import identityRegistryContractAddressReducer from "./slices/identityRegistrySlice";
import erc20RulesContractAddressReducer from "./slices/erc20RulesSlice";

const rootReducer = combineReducers({
  encrytedERC20ContractAddress: encrytedERC20AddressReducer,
  defaultTokenAddress: defaultTokenAddressReducer,
  identityRegistryContractAddress: identityRegistryContractAddressReducer,
  erc20RulesContractAddress: erc20RulesContractAddressReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
