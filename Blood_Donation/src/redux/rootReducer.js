import { combineReducers } from "@reduxjs/toolkit";
import useReducer from "./features/userSlice";
import bloodHistoryReducer from "./features/BloodHistorySlice";

const rootReducer = combineReducers({
  user: useReducer,
  bloodHistory: bloodHistoryReducer,
});

export default rootReducer;
