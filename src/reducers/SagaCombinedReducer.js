import { combineReducers } from "redux";

import loadingReducer from "./SagaLoadingReducer";
import imageReducer from "./SagaImageReducer";
import errorReducer from "./SagaErrorReducer";

const rootReducer = combineReducers({
  isloading: loadingReducer,
  images: imageReducer,
  error: errorReducer
});

export default rootReducer;
