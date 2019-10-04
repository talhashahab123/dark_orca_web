import { IMAGES } from "../components/SagaStatusConstants";

//payload is sent as images property
const imageReducer = (state = [], action) => {
  if (action.type === IMAGES.LOAD_SUCCESS) {
    return [...state, ...action.images];
  }
  return state;
};

export default imageReducer;
