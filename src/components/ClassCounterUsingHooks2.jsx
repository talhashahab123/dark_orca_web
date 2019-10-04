import React, { useState } from "react";
import Button from "react-bootstrap/Button";

export default function HookCounter2() {
  const initialCount = 0;
  //count is a variable
  //setCount is a function

  const [count, setCount] = useState(initialCount);

  //USE state:
  //accepts initial state
  //returns current state
  //a method that can update a set variable

  //funct
  const incrementFive = () => {
    for (let i = 0; i < 5; i++) {
      setCount(prevCount => prevCount + 1);
    }
  };

  //for increment by many time, use prevState
  return (
    <div>
      <Button
        onClick={() => {
          setCount(prevCount => prevCount + 1);
        }}
      >
        Increment One
      </Button>
      <br></br> Count: {count}
      <br></br> <Button onClick={incrementFive}> Increment Five</Button>
    </div>
  );
}
