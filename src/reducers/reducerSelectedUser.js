//a reducer that selects unique item and gives it's results
export default function(state = "", action) {
  switch (action.type) {
    case "USER_SELECTED":
      return action.payload;
    case "fetchedData":
      return action.payload;
    case "FETCH_WEATHER_DATA":
      return action.data;
    case "INPUT_STATE_UPDATE":
      return action.payload;

    default:
      return state;
  }
}

export const InputBoxesUpdater = (state = "", action) => {
  switch (action.type) {
    case "INPUT_STATE_UPDATE": 
      return action.payload;

    default:
      return state;
  }
};
