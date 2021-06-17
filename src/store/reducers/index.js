import Auth from "./Auth";
import Theme from "./Theme";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: Auth,
  theme: Theme,
});

export default rootReducer;
