//import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
//{} used below is to directly access as a function
// rather than first setting it as a variable
import { createStore, applyMiddleware } from "redux";
//from the index file
import allReducers from "./reducers";
import { Provider } from "react-redux";
import App from "./components/App";
