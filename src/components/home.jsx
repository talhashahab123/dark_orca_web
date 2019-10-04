import React, { Component } from "react";

class home extends Component {
  constructor(props) {
    super(props);

    /*setting initial states*/
    this.state = {
      currentUserName: this.props.username,
      currentEmail: this.props.email
    };

    /* Setting states that came from props */
    this.setState({});

    /*binding objects functions for events*/
  }

  render() {
    return (
      <div>
        <h1>Home Page</h1>

        <label>
          UserName: {this.state.currentUserName}
          <br></br>
          Email: {this.state.currentEmail}
          <br></br>
        </label>
      </div>
    );
  }
}

export default home;
