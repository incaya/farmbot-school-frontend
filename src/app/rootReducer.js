import { combineReducers } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/uiSlice";
import counterReducer from "../features/counter/counterSlice";
import userReducer from "../features/user/userSlice";
import learnerReducer from "../features/learner/learnerSlice";
import usergroupReducer from "../features/usergroup/usergroupSlice";
import challengeReducer from "../features/challenge/challengeSlice";
import sequenceReducer from "../features/sequence/sequenceSlice";

export default combineReducers({
  ui: uiReducer,
  counter: counterReducer,
  user: userReducer,
  learner: learnerReducer,
  usergroup: usergroupReducer,
  challenge: challengeReducer,
  sequence: sequenceReducer,
});
