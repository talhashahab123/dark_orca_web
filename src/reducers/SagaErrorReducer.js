import { IMAGES } from "../components/SagaStatusConstants";

//payload is sent as images property
const errorReducer = (state = [], action) => {
  if (action.type === IMAGES.LOAD) {
    return null;
  } else if (action.type === IMAGES.LOAD_SUCCESS) {
    return null;
  } else if (action.type === IMAGES.LOAD_FAIL) {
    return action.error;
  }

  return state;
};

export default errorReducer;
