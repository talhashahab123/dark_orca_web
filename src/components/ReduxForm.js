import React, { Component } from "react";
import { Field, reduxForm, SubmissionError } from "redux-form/immutable";

class ReduxSignUpForm extends Component {
  submit = (values, e, { firstName = "", lastName = "", email = "" }) => {
    console.log("Submit inside form");
    console.log("Val2: " + JSON.stringify(values));
    //Always do JSON.stringify() when it show  Object Object in console

    let error = {},
      isError = false;

    //use values.firstName.trim( for updated val
    //1st
    if (values.firstName.trim() === "") {
      isError = true;
      error.firstName = "Required";
      console.log("First name req");
    } else if (firstName.length > 20) {
      isError = true;
      error.firstName = "Too Long";
      console.log("First name req");
    } else if (firstName.length < 2) {
      isError = true;
      error.firstName = "Minimum Length 2";
      console.log("First name req");
    } else {
      isError = false;
      console.log("First name req");
    }
    console.log("1" + error.firstName);

    //2nd
    if (lastName === "") {
      isError = true;
      error.lastName = "Required";
      console.log("First name req");
    } else if (lastName.length > 20) {
      isError = true;
      error.firstName = "Too Long";
      console.log("First name req");
    } else if (firstName.length < 2) {
      isError = true;
      error.firstName = "Minimum Length 2";
      console.log("First name req");
    } else if (!isError) {
      isError = false;
      console.log("First name req");
    }
    console.log("2" + error.lastName);
    //3rd
    if (email.trim() === "") {
      isError = true;
      error.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      error.email = "Invalid email address";
    } else if (!isError) {
      isError = false;
    }
    console.log("3" + error.email);

    if (isError) {
      throw new SubmissionError(error);
    } else {
      //submit form
      console.log("FORM OK TO BE SUBMITTED");
    }
  };
  renderField = ({ label, input, meta: { touched, error, warning } }) => (
    <div className="input-row">
      <br />
      <label>{label}</label>
      <br />
      <input {...input} type="text" />
      {touched && error && <span className="error">{error}</span>}
    </div>
  );

  render() {
    return (
      <form onSubmit={this.props.handleSubmit(this.submit)}>
        <div>
          <Field
            name="firstName"
            label="First Name"
            component={this.renderField}
            type="text"
          />
        </div>
        <div>
          <Field
            name="lastName"
            label="Second Name"
            component={this.renderField}
            type="text"
          />
        </div>
        <div>
          <Field
            name="email"
            label="Email"
            component={this.renderField}
            type="email"
          />
        </div>
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

ReduxSignUpForm = reduxForm({
  form: "contact"
})(ReduxSignUpForm);

export default ReduxSignUpForm;
