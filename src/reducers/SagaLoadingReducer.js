import { IMAGES } from "../components/SagaStatusConstants";

//payload is sent as images property
const loadingReducer = (state = [], action) => {
  if (action.type === IMAGES.LOAD) {
    return true;
  } else if (action.type === IMAGES.LOAD_SUCCESS) {
    return false;
  } else if (action.type === IMAGES.LOAD_FAIL) {
    return false;
  }

  return state;
};

export default loadingReducer;
