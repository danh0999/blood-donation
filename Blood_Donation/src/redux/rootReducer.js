import { combineReducers } from "@reduxjs/toolkit";
import useReducer from "./features/userSlice";
import bloodHistoryReducer from "./features/BloodHistorySlice";
import accountSlice from "./features/accountSlice";

const rootReducer = combineReducers({
  user: useReducer,
  bloodHistory: bloodHistoryReducer,
  account: accountSlice,
});

export default rootReducer;
