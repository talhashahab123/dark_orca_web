import React, { Component } from "react";
import { connect } from "react-redux";

class UserDetails extends Component {
  constructor(props) {
    super(props);
  }
  render() {

    if (this.props.user == null) {
      return null;
    }

    return (
      <div>
        <br></br>
        <h2>
          Latitude:
          {this.props.user.latitude}
        </h2>
        <br></br>
        <h2>
          Longitude:
          {this.props.user.longitude}
        </h2>
        <br></br>
      </div>
    );
  }


}

//1 makes the state to 1st reducer
//2 THE state passed as parameter is the store
function mapStateToProps(state) {
  return {
    user: state.activeUser
  };
}

export default connect(mapStateToProps)(UserDetails);






/*
WHOLE RENDER PREVIOUSLY

    if (this.props.user == null) {
      return null;
    }

    return (
      <div>
        <img src={this.props.user.thumbnail} />
        <br></br>
        <h2>
          {this.props.user.first} {this.props.user.last}
        </h2>
        <br></br>
        <h2>
          Age:
          {this.props.user.age}
        </h2>
        <br></br>
        <h2>
          Description:
          {this.props.user.description}
        </h2>
        <br></br>
        <h2>
          Latitude:
          {this.props.user.latitude}
        </h2>
        <br></br>
        <h2>
          Longitude:
          {this.props.user.longitude}
        </h2>
        <br></br>
      </div>
    );
  }

*/

