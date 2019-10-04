import React, { Component } from "react";
import ChildListStateUp from "./LiftingStateUpComponent";

class StateLiftedParent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  incrementCount = () => {
    this.setState({ count: this.state.count + 1 });
  };
  render() {
    return (
      <div>
        <h1>HERE WE LIFTED STATE UP</h1>
        <ChildListStateUp
          incrementCount={this.incrementCount}
          count={this.state.count}
        />
        <ChildListStateUp
          incrementCount={this.incrementCount}
          count={this.state.count}
        />
      </div>
    );
  }
}

export default StateLiftedParent;
