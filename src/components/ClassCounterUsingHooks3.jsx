import React, { useState } from "react";
import Button from "react-bootstrap/Button";

export default function HookCounter3() {
  var initialState = { firstName: "", lastName: "" };
  const [name, setName] = useState(initialState);

  //USE state:
  //accepts initial state
  //returns current state
  //a method that can update a set variable

  //    name is a variable declared

  //for increment by many time, use prevState

  //if firstname is written,
  //last name is lost state
  //AS  IT DOESNT AUTOMATICALLY UPDATES THE CLASS COMPONENT

  //THE spread operator in inputs set the name and then overrides
  //firstname and lastname property in the object @runtime

  //the setter funct doesnot automaticaally updates/concatenate the value.
  //u have to do it yourself.
  return (
    <div>
      <input
        type="text"
        value={name.firstName}
        onChange={e => setName({ ...name, firstName: e.target.value })}
        placeholder="First Name"
      />
      <input
        type="text"
        onChange={e => setName({ ...name, lastName: e.target.value })}
        placeholder="Last Name"
      />
      <h2>Your First Name is: {name.firstName}</h2>
      <h2>Your Last Name is: {name.lastName}</h2>
      <h2>Object: {JSON.stringify(name)}</h2>
    </div>
  );
}
