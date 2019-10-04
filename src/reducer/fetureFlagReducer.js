//Wish Reducer detects if the action type is ADD_WISH
const featureFlagReducer = (state = "", action) => {
  console.log("---------------REDUX START--------------------");
  console.log("featureFlagReducer REDUCER CALLED");
  //in case if action done so this if works for this functiom

  if (action.type == "NEW_FEATURE_FLAG_STATE") {
    console.log(
      "ACTION NEW_FEATURE_FLAG_STATE CALLED inside featureFlagReducer"
    );
    console.log(
      "Action payload after NEW_FEATURE_FLAG_STATE: " + action.payload
    );
    console.log(
      "Action object after NEW_FEATURE_FLAG_STATE: " +
        JSON.stringify(action, null, 4)
    );
    console.log("-------------REDUX END----------------------");

    return action.payload;
  }
  return state;
};

export default featureFlagReducer;
