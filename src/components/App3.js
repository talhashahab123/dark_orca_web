import React, { Component } from "react";

import HeaderSection from "./SagaHeader";
import ImageGrid from "./SagaImageGrid";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <h1>Redux Saga</h1>
        <HeaderSection />
        <ImageGrid />
      </div>
    );
  }
}

export default App;
