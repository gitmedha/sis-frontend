import Auth from "./Auth";
import sessionAttendance from "./sessionAttendances";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: Auth,
  sessionAttendance,
});

export default rootReducer;
