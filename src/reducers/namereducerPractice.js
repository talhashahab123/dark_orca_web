/*
//initial state data
const iState = {
  name: "Talha",
  work: ["eat", "Developer", "sleep"]
};
*/
//takes state and action
const namereducer = (state = "", action) => {
  console.log("Name PRACTICE REDUCER CALLED");

  //Name reducer will detect that the action type is
  //Change_Name
  //in case if action done so this if works for this functiom
  if (action.type == "Change_Name") {
    //...state means state of all previous objects are also saved

    //1 Before global state introduced
    /*
    return {
      ...state,
      name: action.payload
    };
    */

    //2 after global state for all combine reducers, we return like this
    return action.payload;
  }

  return state;
};

export default namereducer;
