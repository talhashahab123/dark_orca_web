import { createStore, compose } from "redux";
import rootReducer from "../reducers/SagaCombinedReducer";

const configureStore = () => {
  const initial_state = { developer_name: "talha", image_url: "abc.html" };
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(rootReducer, initial_state, composeEnhancers);
  return store;
};

export default configureStore;
