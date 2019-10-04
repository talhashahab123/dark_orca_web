import React, { useState } from "react";
import Button from "react-bootstrap/Button";

export default function HookCounter() {
  //count is a variable
  //setCount is a function
  const [count, setCount] = useState(0);

  //USE state:
  //accepts initial state
  //returns current state
  //a method that can update a set variable

  return (
    <div>
      <Button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Count: {count}
      </Button>
    </div>
  );
}
