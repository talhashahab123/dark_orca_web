import React, { Component } from "react";

class Errors404 extends Component {
  constructor(props) {
    super(props);

    /*setting initial states*/
    this.state = { currentEmail: "", currentUserName: "" };

    /*binding objects functions for events*/
  }

  render() {
    return (
      <div>
        <h1>ERROR 404: Sign in to access home page</h1>
      </div>
    );
  }
}

export default Errors404;
