import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import UserList from "../containers/usersList";
import UserDetails from "../containers/userDetails";
import { UpdateInputState } from "../action";
import ReduxSignUpForm from "./ReduxForm";
import FormicForm from "./FormicFormClassComponent";

//hr is a horizontal row
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", reduxObject: null };
    this.onFormSubmitMark = this.onFormSubmitMark.bind(this);
  }

  onFormSubmitMark = e => {
    e.preventDefault();
  };

  onChange = e => {
    this.setState({ reduxObject: JSON.stringify(this.props.currentInput) });
    console.log("\n\nInside OnChange");
    console.log(
      "state now of compponent: " + JSON.stringify(this.props.currentInput)
    );
    console.log(
      "state2 now of compponent: " + JSON.stringify(this.state.reduxObject)
    );
    console.log(
      "Change Ouccured\n{\nName: " +
        JSON.stringify(this.props.currentInput.SignUpName) +
        " \nEmail: " +
        JSON.stringify(this.props.currentInput.SignUpEmail) +
        "\nPassword: " +
        JSON.stringify(this.props.currentInput.SignUpPass) +
        "\n}"
    );
    if (e.target.name == "email") {
      console.log("Inside if of onchnage IN EMAIL");
      this.props.UpdateInputState(e.target.value, "email");
    } else if (e.target.name == "name") {
      console.log("Inside if of onchnage IN NAME");
      this.props.UpdateInputState(e.target.value, "name");
    } else if (e.target.name == "pass") {
      console.log("Inside if of onchnage IN PASS");
      this.props.UpdateInputState(e.target.value, "pass");
    }
  };

  //IF WE USE SEPARATE ACTIONS FOR EACH, BUT EACH ACTION DOES THE SAME TASK
  //IF WE USE SEPARATE REDUCERS, RETURN ALWAYS THE RECENT DATA AND MAKING THE OBJECT

  render() {
    return (
      <div>
        {/*   <FormicForm />
         */}{" "}
        <br></br>
        <br></br>
        <br></br>
        {/*       <h1>Other Things</h1>
        <h2>Username List:</h2>
        <UserList />
        <hr />
        <h2>User Details:</h2>
        <UserDetails />
    */}
        <br></br>
        {/** 
        <form onSubmit={this.onFormSubmitMark} onChange={this.onChange}>
          <input
            type="text"
            placeholder="Enter Name"
            name="name"
            value={this.props.currentInput.SignUpName}
          />
          <input
            type="text"
            placeholder="Enter Email"
            name="email"
            value={this.props.currentInput.SignUpEmail}
          />
          <input
            type="text"
            placeholder="Enter Password"
            name="pass"
            value={this.props.currentInput.SignUpPass}
          />
        </form>
        */}
        <h2>Redux signup form by REDUX-FORM</h2>
        <ReduxSignUpForm />
      </div>
    );
  }
}

function mapStateToProps(state) {
  //makes the state to 2nd reducer in all reducers
  return {
    currentInput: state.InputBoxesUpdater
  };
}
//UpdateInputState is the action which calls reducer called InputBoxesUpdater
function matchDispatchToProps(dispatch) {
  return bindActionCreators({ UpdateInputState }, dispatch);
}

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(App);
