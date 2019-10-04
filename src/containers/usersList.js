import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
//action imported
import { selectUser } from "../action";

//ANY ACTION THAT OCCURS GOES DIRECTLY TO REDUCERS
class UsersList extends Component {
  constructor(props) {
    super(props);
  }

  //select user is an action(action calls the reducer)
  createListItems() {
    //click krne pr action perform kare!
    return this.props.users.map(user => {
      return (
        <li key={user.id} onClick={() => this.props.selectUser(user)}>
          {user.first} {user.last}
        </li>
      );
    });
  }
  render() {
    return (
      <div>
        <ul>{this.createListItems()}</ul>
        <br></br>
        {this.props.activeUsers != null
          ? this.props.activeUsers.latitude
          : "ACTIVE USERS NULL"}
      </div>
    );
  }
}

//map state to props takes out state from store and makes them the props of the component
//when it renders

//TAKES DATA FROM STORE INTO CURRENT STATE
//maps the current state[STORE] of app to props of this componenet ie UsersList
function mapStateToProps(state) {
  //makes the state to 2nd reducer in all reducers
  return {
    users: state.users,
    activeUsers: state.activeUser
  };  
}

//defines an action(the one in index.js)
//selectUser is an action exposed/dispatched after it was imported
// from the actions folder

//mapDispatchToProps is
//used for dispatching actions to the store. (ACTION => STORE)
//NOW STORE HAS AN ACTION
//1 click
//2 action selectUser
//3 action => store (dispatch using matchDispatchToProps)
//4
//SENDS DATA TO STORE ON ACTION
function matchDispatchToProps(dispatch) {
  return bindActionCreators({ selectUser }, dispatch);
}

//defines that we can connect this func to user list
//With react - redux.connect we can connect our redux store to a component:
export default connect(
  mapStateToProps,
  matchDispatchToProps
)(UsersList);
