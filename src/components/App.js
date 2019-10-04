import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import UserList from "../containers/usersList";
import UserDetails from "../containers/userDetails";
import { UpdateInputState } from "../action";
import ReduxSignUpForm from "./ReduxForm";
import FormicForm from "./FormicFormClassComponent";
import Button from "react-bootstrap/Button";
import {
  anotherName,
  addAWish,
  ChangeInputBoxValue
} from "../action/actionPractice";
import { Input } from "reactstrap";
//hr is a horizontal row
class ReduxApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { personName: "", personWish: "" };
    this.onFormSubmitMark = this.onFormSubmitMark.bind(this);
    this.myAllwishes = this.myAllwishes.bind(this);
  }

  myAllwishes = () => {};

  onFormSubmitMark = e => {
    e.preventDefault();
  };

  onChange = e => {
    this.setState({ personName: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
  };
  //IF WE USE SEPARATE ACTIONS FOR EACH, BUT EACH ACTION DOES THE SAME TASK
  //IF WE USE SEPARATE REDUCERS, RETURN ALWAYS THE RECENT DATA AND MAKING THE OBJECT

  render() {
    console.log("Props: " + JSON.stringify(this.props, null, 4));
    // console.log("Input vals: " + JSON.stringify(this.props.Input.na, null, 4));

    return (
      <div>
        <h1>Redux Practice App</h1>
        <p>Got Data from Redux: {this.props.myname}</p>
        <h1>My Wishes List:</h1>
        {this.props.mywish.map((item, idx) => {
          return (
            <div>
              <p key={Math.random()}>{item}</p>
            </div>
          );
        })}
        <form onSubmit={this.handleSubmit}>
          <Input
            name="personName"
            value={this.props.changedInput1Value}
            onChange={this.props.ChangeInputBox1}
            placeholder="Enter Person Name"
          />
          <Input name="personWish" placeholder="Enter Person Wish" />
          <Button
            onClick={() => {
              this.props.changeName("Shahab");
            }}
          >
            Change Name [Name Reducer]
          </Button>
          <br></br>
          <br></br>
          <Button
            onClick={() => {
              this.props.addWish();
            }}
          >
            Add a Wish [Wish Reducer]
          </Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  //receives state of all reducer as it is rendered inside a provider
  //that has store attCHED
  console.log(
    "Now State of Store [inside App.js] : " + JSON.stringify(state, null, 4)
  );

  //it returns an object - name and wish object
  //are same as provided to combine reducer
  //THIS IS KIND OF THE STATE OBJECT [ this.state ]
  return {
    myname: state.name,
    mywish: state.wish,
    changedInput1Value: state.inputBoxChanger
  };
};

//hum render me prop se aik method use karne wale hein.
//and ye method is function se props me add ho jaega
const mapDispatchToProps = dispatch => {
  //it returns an object
  return {
    changeName: name => {
      dispatch(anotherName(name));
    },
    addWish: () => {
      dispatch(addAWish());
    },
    ChangeInputBox1: event => {
      dispatch(ChangeInputBoxValue(event));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxApp);
