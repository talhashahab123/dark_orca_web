import React, { useState } from "react";
import Button from "react-bootstrap/Button";

export default function HookCounter4() {
  var initialState = [];
  const [item, setItems] = useState(initialState);

  const addItem = () => {
    setItems([
      ...item,
      { id: item.length, value: Math.floor(Math.random() * 10 + 1) }
    ]);
  };

  return (
    <div>
      <Button onClick={addItem}>Push a Number</Button>
      <ul>
        {item.map(items => (
          <li key={items.id}>{items.value}</li>
        ))}
      </ul>
    </div>
  );
}
