//COMBINE REDUCERS WILL COMBINE TO MAKE ONE SINGLE JS OBJECT IE THE STORE
import { combineReducers } from "redux";
import ActiveUserReducer from "./reducerSelectedUser";
import UserReducer from "./reducerUsers";
import InputBoxesUpdater from "./reducerSelectedUser";
import { reducer as formReducer } from "redux-form";

//import DataFetching from "./reducerUsers";
//THIS IS THE MAIN BIG OBJECT THAT IS GOING TO BE
//THTROWN INSIDE THE STORE
//  HERE this object users is all equal to the whole data in
//  the reducerUsers File

//const instance = new DataFetching(); // Data Fetching {}
//const result = instance.dataFetchedResult(); //all data
//const UserReducer = result;

const allReducers = combineReducers({
  users: UserReducer,
  activeUser: ActiveUserReducer,
  InputBoxesUpdater,
  form: formReducer
});

//REDUCER RETURNS AN OBJECT of many data object
//COMBINED REUDUCER RETURNS A LIST OF DATA OBJECT of
//differnt types(like mobvies,users, etc) and
//form the one big JAVASCRIPT OBJECT OUT OF IT
//THAT CAN BE USED TO SEND IN STORE LATER ONWARDS

export default allReducers;
