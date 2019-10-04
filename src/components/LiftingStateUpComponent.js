import React, { Component } from "react";
import Button from "react-bootstrap/Button";
class ChildListStateUp extends Component {
  render() {
    return (
      <div>
        <Button onClick={this.props.incrementCount}>
          Count: {this.props.count}
        </Button>
      </div>
    );
  }
}

export default ChildListStateUp;
