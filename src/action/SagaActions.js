import IMAGES from "../components/SagaStatusConstants";

const loadImages = () => ({
  type: IMAGES.LOAD
});

const setImages = fetchedImage => ({
  type: IMAGES.LOAD_SUCCESS,
  fetchedImage
});

const setError = error => ({
  type: IMAGES.LOAD_FAIL,
  error
});

export { loadImages, setImages, setError };
