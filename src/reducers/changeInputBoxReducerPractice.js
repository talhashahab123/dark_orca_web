//Wish Reducer detects if the action type is ADD_WISH
const changeInputBoxReducer = (state = "", action) => {
  console.log("changeInputBoxReducer PRACTICE REDUCER CALLED");
  //in case if action done so this if works for this functiom

  if (action.type == "CHANGE_INPUTBOX") {
    console.log("ACTION CHANGE_INPUTBOX CALLED");
    console.log("Action payload after input change box: " + action.payload);
    console.log(
      "Action object after input change box: " + JSON.stringify(action, null, 4)
    );
    return action.payload;
  }
  return state;
};

export default changeInputBoxReducer;
