//initial state data
/*
const iState = {
  name: "Talha",
  work: ["eat", "Developer", "sleep"]
};
*/

//index.js se mili hui state har jagah improvise hoti ha
//takes state and action
//Wish Reducer detects if the action type is ADD_WISH
const wishreducer = (state = [], action) => {
  console.log("Wish PRACTICE REDUCER CALLED");
  //  console.log("ACTION: " + JSON.stringify(action, null, 4));
  //  console.log("STATE:" + JSON.stringify(state, null, 4));

  //in case if action done so this if works for this functiom
  if (action.type == "ADD_WISH") {
    //...state means state of all previous objects are also saved
    return [...state, action.payload];
  }

  return state;
};

export default wishreducer;
