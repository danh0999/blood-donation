import { combineReducers } from "@reduxjs/toolkit";
import useReducer from "./features/userSlice";
import bloodHistoryReducer from "./features/BloodHistorySlice";
import accountSlice from "./features/accountSlice";
import programSlice from "./features/programSlice";
import bloodRequestReducer from "./features/bloodRequestSlice";

const rootReducer = combineReducers({
  user: useReducer,
  bloodHistory: bloodHistoryReducer,
  account: accountSlice,
  bloodRequest: bloodRequestReducer,
  program: programSlice,
});

export default rootReducer;
