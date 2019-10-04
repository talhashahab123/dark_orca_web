import React, { Component } from "react";
import {
  withFormik,
  Formik,
  ErrorMessage,
  FormikProps,
  Form,
  Field
} from "formik";
import * as Yup from "yup";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";

const SignupSchema = Yup.object().shape({
  userName: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  email: Yup.string().required("Required"),
  password: Yup.string()
    .min(6, "Too Short!")
    .required("Required"),
  companyName: Yup.string().required("Required")
});

export default class FormicForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      companyName: "",
      email: "",
      userName: ""
    };
  }

  componentDidMount() {
    const cors = require("cors");
    console.log("Inside componentDidMount");
    console.log("Fetching data in componentDidMount");

    /*    console.log("1st data");
    fetch("/api/v1/register", {
      mode: "cors",
      headers: {
        ContentType: "application/xml"
      },
      method: "post",
      body: { name: "talha" }
    })
      .then(response => {
        console.log("Response");
        console.log(response);
        return JSON.stringify(response);
      })
      .then(data => {
        console.log("Data");
        console.log(data);
      });
   

    console.log("2nd data");
    axios
      .post("/api/v1/register")
      .then(response => {
        console.log("Response 2");
        console.log(response);
        return JSON.stringify(response);
      })
      .then(data => {
        console.log("Data 2");
        console.log(data);
      });
 */
    var ss =
      "Missing RapidAPI application key. Go to https://docs.rapidapi.com/docs/keys to learn how to get your API application key.";
    console.log("Length: " + ss.length);
    console.log("3rd data");
    var data = {
      key1: "val1",
      key2: "val2"
    };
    axios
      .post(
        "https://mikerlynn-text-tone-v1.p.rapidapi.com/api/sentiment/v1",

        {
          headers: {
            "x-rapidapi-host": "mikerlynn-text-tone-v1.p.rapidapi.com",
            "x-rapidapi-key":
              "93c5b6f5f0msh37248c74e76a5eap137360jsndfd4ea31dc3a",
            "content-type": "application/json",
            accept: "application/json"
          }
        }
      )
      .then(response => {
        console.log("Response 3");
        console.log(response);
        return JSON.stringify(response);
      })
      .then(data => {
        console.log("Data 3");
        console.log(data);
      });
  }

  render() {
    return (
      <div>
        <br></br>
        <br></br>
        <br></br>
        {/** 
    Formik Form
    */}
        <h1> Registration Formic Class</h1>
        <br></br>
        <br></br>
        <Formik
          initialValues={this.state}
          validationSchema={SignupSchema}
          onSubmit={(values, actions) => {
            console.log("Inside submit click");
            setTimeout(() => {
              console.log(JSON.stringify(values, null, 2));
              this.setState(
                {
                  password: values.password,
                  companyName: values.companyName,
                  email: values.email,
                  userName: values.userName
                },
                () => {
                  console.log(
                    "State after update is: " +
                      JSON.stringify(this.state, null, 4)
                  );
                }
              );
              actions.setSubmitting(false);
            }, 1000);
          }}
          render={props => (
            <Form onSubmit={props.handleSubmit}>
              <h4>Username</h4>
              <Field
                name="userName"
                type="text"
                placeholder="Enter Your Username"
                onBlur={props.handleBlur}
              />
              <ErrorMessage name="userName" />
              <br></br>
              <h4>Email</h4>
              <Field
                name="email"
                type="text"
                placeholder="Enter Your Email"
                onBlur={props.handleBlur}
              />
              <ErrorMessage name="email" />
              <br></br>
              <h4>Password</h4>
              <Field
                name="password"
                type="password"
                placeholder="Enter Your Password"
                onBlur={props.handleBlur}
              />
              <ErrorMessage name="password" />
              <h4>Company Name</h4>
              <Field
                name="companyName"
                type="text"
                placeholder="Enter Your Company"
                onBlur={props.handleBlur}
              />
              <ErrorMessage name="companyName" />
              <br></br>
              <br></br>
              <br></br>
              <button type="submit">Register Now</button>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
            </Form>
          )}
        />
      </div>
    );
  }
}
