import React, { Component } from "react";
import Home from "./home";
import Errors404 from "./errors404";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    /*setting initial states*/
    this.state = {
      email: "",
      pass: "",
      submitPossible: false,
      authPossible: false,
      validationChecks: false,
      existingName: "Talha",
      existingEmail: "1@1.com",
      existingPass: "123456",
      loggedIn: false,
      submitClicked: false
    };

    /*binding objects functions for events*/
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkFormSubmissionAllowed = this.checkFormSubmissionAllowed.bind(
      this
    );
    this.checkFormSubmissionValidation = this.checkFormSubmissionValidation.bind(
      this
    );
    this.checkFormSubmissionAuthentication = this.checkFormSubmissionAuthentication.bind(
      this
    );
  }

  /* An email gets set as soon as user brings it up */
  handleEmailChange(event) {
    this.setState({ email: event.target.value });
    console.log("Changing Email");
    console.log("EMAIL Changed to: " + event.target.value);
  }

  /* A password gets set as soon as user brings it up */
  handlePasswordChange(event) {
    this.setState({ pass: event.target.value });
    console.log("Changing Password");
    console.log("Password Changed to: " + event.target.value);
  }

  /* 3 checks */
  checkFormSubmissionAllowed() {
    console.log("Checking if EMAIL AND PASSWORD FIELD are EMPTY [ALLOWED?]");
    if (this.state.email === "" || this.state.pass === "") {
      return false;
    } else if (this.state.email !== "" && this.state.pass !== "") {
      return true;
    }
  }

  checkFormSubmissionValidation() {
    console.log("Check Validation [Format?]");
    return true;
  }

  checkFormSubmissionAuthentication() {
    console.log("Check User Authentication [Legal User?]");
    if (
      this.state.email === this.state.existingEmail &&
      this.state.pass === this.state.existingPass
    ) {
      return true;
    } else {
      return false;
    }
  }

  /* 
      Conditions are return by other 3 check functions
      this fuction sets state, waits for setting state and dom synchroniziation with virutal dom,
      calls the callBack arrow function which then stops the loading[for the time being, using a loading spinner
      wont be a bad idea]  and allows user to authenticate/move to next page and displays pop up message of logged in

      1- Checks if all true by other 3 function returns
      2- SetState and wait
      3- Logs in

      The final condition of this function is always a logged in user!

      NEVER CHECK A CONDITION AGAINST STATES
      NIETHER PRINT A STATE IN CONSOLE TO CHECK IF IT IS TRUE OR NOT

      ONLY CHECK AFTER A CALL BACK FUNTION ON SETTING STATES

  */

  stateSettingAndLoggingInFunction() {
    this.setState(
      {
        submitPossible: true,
        validationChecks: true,
        authPossible: true
      },
      () => {
        console.log(" All States Set - USER LOGGED IN ");
        /* Alert logged */
        alert(
          "Email: " +
            this.state.email +
            "\n" +
            "Password: " +
            this.state.pass +
            "\n" +
            "Authentication Success" +
            "\n"
        );

        /* Now set login to true to navigate to home screen */
        this.setState({
          loggedIn: true,
          submitClicked: true
        });
      }
    );
  }

  handleSubmit(event) {
    console.log(
      "----------------------------------------------------------------"
    );
    console.log("Submit clicked");
    console.log("\n\nNow Checking...\n\n");
    /*RUNNING ALL CHECKS*/
    if (
      this.checkFormSubmissionAllowed() &&
      this.checkFormSubmissionValidation() &&
      this.checkFormSubmissionAuthentication()
    ) {
      console.log("Now setting states and waiting [SHOW SPINNER LOAD]..");
      this.stateSettingAndLoggingInFunction();
    } else {
      /* Not logged in debug */
      console.log(
        "\nUnable to log in - REASON PRINTED BELOW \n\nAllowed:" +
          this.checkFormSubmissionAllowed() +
          " \nFormat[ALWAYS TRUE]:" +
          this.checkFormSubmissionValidation() +
          " \nAuth:" +
          this.checkFormSubmissionAuthentication() +
          " \n\nemailGiven:" +
          this.state.email +
          " emailDB:" +
          this.state.existingEmail +
          " \npassGiven:" +
          this.state.pass +
          " passDB:" +
          this.state.existingPass +
          "\n"
      );

      /* Set submit click to true AS IN BOTH CASES */
      this.setState({ submitClicked: true });

      console.log("CHECKING AGAIN WHERE THE ERROR OCCURED...\n\n");
      //FEEDBACK TO USER
      if (!this.checkFormSubmissionAllowed()) {
        alert("Please Fill All The Boxes Before Clicking Submit");
      } else if (!this.checkFormSubmissionValidation()) {
        alert("Email Format is incorrect");
      } else if (!this.checkFormSubmissionAuthentication()) {
        /* Alert not logged */
        alert(
          "Email: " +
            this.state.email +
            "\n" +
            "Password: " +
            this.state.pass +
            "\n" +
            "Authentication Failed" +
            "\n"
        );
      }
      console.log("\n\n===============SUBMIT ENDS================n\n");
    }

    /* Dont Reload page, maintain state */
    event.preventDefault();
  }

  conditionalRenderer() {}

  render() {
    return (
      <div>
        {!this.state.loggedIn && !this.state.submitClicked && (
          <form onSubmit={this.handleSubmit}>
            <label>
              Email:
              <input
                type="email"
                name="email"
                onChange={this.handleEmailChange}
              />
            </label>

            <label>
              Password:
              <input
                type="password"
                name="pass"
                onChange={this.handlePasswordChange}
              />
            </label>

            <input type="submit" value="Login" />

            <br></br>
            <label>Login Status: {this.state.loggedIn}</label>
          </form>
        )}
        {this.state.loggedIn && this.state.submitClicked && (
          <Home
            username={this.state.existingName}
            email={this.state.existingEmail}
          />
        )}
        {!this.state.loggedIn && this.state.submitClicked && <Errors404 />}
      </div>
    );
  }
}

//myform = () => {};

export default LoginForm;
