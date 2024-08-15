// store.js
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import encrytedERC20AddressReducer from "./slices/userSlice";
import defaultTokenAddressReducer from "./slices/normalERCSlice";

const rootReducer = combineReducers({
  encrytedERC20ContractAddress: encrytedERC20AddressReducer,
  defaultTokenAddress: defaultTokenAddressReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
