import { combineReducers } from "redux";
import authReducer from "./auth/authSlice";
import commonReducer from "./common/commonSlice";
import conversationReducer from "./conversation/conversationSlice";

const rootReducer = combineReducers({
  authReducer,
  commonReducer,
  conversationReducer,
});

export default rootReducer;
