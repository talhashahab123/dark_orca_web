//import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
//import App from "./App";
//{} used below is to directly access as a function
// rather than first setting it as a variable
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
//from the index file
import allReducers from "./reducers";
import { Provider } from "react-redux";

//Redux Practice App
//import App from "./components/App";
//Bucky User list And Details and formic Component[updates 1 looses the other] and Redux forms[Field redux states ]
import App from "./components/App2";
//Redux Saga vid 3 to do
//import App from "./components/App3";
import ReduxApp from "./components/App";
import * as serviceWorker from "./serviceWorker";
import LoginForm from "./components/loginForm";
//import MyForm from "./components/dynamicForms";
import MyForm from "./components/dynamicFormsComponents/dynamicFom";
import ClassCounter from "./components/ClassCounterHook";
import HookCounter from "./components/ClassCounterUsingHooks";
import HookCounter2 from "./components/ClassCounterUsingHooks2";
import HookCounter3 from "./components/ClassCounterUsingHooks3";
import HookCounter4 from "./components/ClassCounterUsingHooks4";
import DataFetching from "./components/FetchData";
import StateLiftedParent from "./components/StateLiftedParent";
import thunk from "redux-thunk";
import fetchMyWeatherData from "./action/index";
import namereducer from "./reducers/namereducerPractice";
import wishreducer from "./reducers/wishreducerPractice";
import changeInputBoxReducer from "./reducers/changeInputBoxReducerPractice";
import configureStore from "./store/SagaStore";
import FormicForm from "./components/FormicFormClassComponent";
import featureFlagReducer from "./reducer/fetureFlagReducer";

//composeEnhancer used for access to dev tool in the browser

//CREATING A STORE
//A STORE IS DECLARED CONSTANT as till end we will not change it ourself
//else throws errors

/*  Store 1 for app2.js
const initialState = {
  users: {},
  activeUser: {},
  InputBoxesUpdater: { name: "", email: "", pass: "" },
  form: {}
};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  allReducers,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

console.log(
  "Current State of Store: " + JSON.stringify(store.getState(), null, 4)
); // 0

*/

/*
//Render 1 for Store1 APp2.js

ReactDOM.render(
  <div>
    <Provider store={store}>
      <App />
    </Provider>
  </div>,
  document.getElementById("root")
);
*/

//you have all reducer as store here defines all the reducers
//1 which selects unique item
//2 which sends all items

/*
// STORE 2 for app.js redux done tutorial hindi
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//store object is the initial state
const storeObject = {
  name: "Talha",
  wish: ["eat", "Developer", "sleep"],
  inputBoxChanger: "initial input"
};

//here now
//name is for name reducer and
//wish is for wish reducer
//SPECIFIED TO IT

//THIS JSON OBJECT MMUST HAVE SAME NAME AS STORE OBJECT(INITIAL STATE)
const javscriptObjectOfAllReducer = {
  name: namereducer,
  wish: wishreducer,
  inputBoxChanger: changeInputBoxReducer
};

const masterReducer = combineReducers(javscriptObjectOfAllReducer);
//createStore is combination of masterReducer, storeObjectInitial and middleware passed
const store2 = createStore(
  masterReducer,
  storeObject,
  composeEnhancers(applyMiddleware(thunk))
);
//we send to app a store containing
//1 all reducers: name and wish
//2 object of initial state
//3 thunk for fetch data

console.log(
  "Initial State of Store [inside Index.js]: " +
    JSON.stringify(store2.getState(), null, 4)
);

//Render 2 for store 2 - app.js
ReactDOM.render(
  <Provider store={store2}>
    <ReduxApp />
  </Provider>,
  document.getElementById("root")
);
*/
/*
render 3 for app3.js (Find store for it - maybe a store folder is imported)
//TO BE CONTINUED
//For redux SAGA
ReactDOM.render(
  <Provider store={configureStore}>
    <App />
  </Provider>,
  document.getElementById("root")
);
*/

//ReactDOM.render(<loginForm />, document.getElementById("root"));
//ReactDOM.render(<MyForm />, document.getElementById("root"));
//ReactDOM.render(<ClassCounter />, document.getElementById("root"));
//ReactDOM.render(<DataFetching />, document.getElementById("root"));
//ReactDOM.render(<StateLiftedParent />, document.getElementById("root"));
//ReactDOM.render(<FormicForm />, document.getElementById("root"));

/** Dynamic FORM WITH REDUX */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//store object is the initial state
const storeObject = {
  featureFlag: [
    {
      key: "key 1",
      name: "Feature 1",
      description: "Description of the Feature",
      switchOn: false,
      Variation: [
        {
          name: "Variation Name",
          key: "key of the Variation",
          description: "Description of the Variation"
        }
      ]
    }
  ]
};

//here now
//name is for name reducer and
//wish is for wish reducer
//SPECIFIED TO IT

//THIS JSON OBJECT MMUST HAVE SAME NAME AS STORE OBJECT(INITIAL STATE)
/*
const javscriptObjectOfAllReducer = {
  featureFlag: [
    {
      key: featureFlagReducer,
      name: featureFlagReducer,
      description: featureFlagReducer,
      switchOn: featureFlagReducer,
      Variation: [
        {
          name: featureFlagReducer,
          key: featureFlagReducer,
          description: featureFlagReducer
        }
      ]
    }
  ]
};
*/
const javscriptObjectOfAllReducer = {
  featureFlag: featureFlagReducer
};

const masterReducer = combineReducers(javscriptObjectOfAllReducer);
//createStore is combination of masterReducer, storeObjectInitial and middleware passed
const store2 = createStore(
  masterReducer,
  storeObject,
  composeEnhancers(applyMiddleware(thunk))
);
//we send to app a store containing
//1 all reducers: name and wish
//2 object of initial state
//3 thunk for fetch data

console.log(
  "Initial State of Store [inside Index.js]: " +
    JSON.stringify(store2.getState(), null, 4)
);

//Render 2 for store 2 - app.js
ReactDOM.render(
  <Provider store={store2}>
    <MyForm />
  </Provider>,
  document.getElementById("root")
);

/** Dynamic FORM WITH REDUX ENDS */
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
