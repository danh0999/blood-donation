import { combineReducers } from "@reduxjs/toolkit";
import useReducer from "./features/userSlice";
import bloodHistoryReducer from "./features/BloodHistorySlice";
import accountSlice from "./features/accountSlice";
import programSlice from "./features/programSlice";
import bloodRequestReducer from "./features/bloodRequestSlice";
import addressSlice from "./features/addressSlice";

const rootReducer = combineReducers({
  user: useReducer,
  bloodHistory: bloodHistoryReducer,
  account: accountSlice,
  bloodRequest: bloodRequestReducer,
  program: programSlice,
  address: addressSlice,
});

export default rootReducer;
