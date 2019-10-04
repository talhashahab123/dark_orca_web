import store2 from "../index";

export const anotherName = name => {
  //The below return only perform an action and no redux thunk is utitlized
  //    return { type: "Change_Name", payload: name };
  //DOING FETCH WITHOUT ASYNC AWAIT
  /*
  return dispatch => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(resp => resp.json())
      .then(resp2 => {
        dispatch({ type: "Change_Name", payload: resp2[0].name });
      });
  };
    */

  //DOING FETCH WITH ASYNC AWAIT
  return async dispatch => {
    const resp = await fetch("https://jsonplaceholder.typicode.com/users");
    const resp2 = await resp.json();
    dispatch({ type: "Change_Name", payload: resp2[0].name });
  };
};

//WHEN AN ACTION IS DIPATCHED,
//BOTH THE REDUCERS ARE RUN..
export const addAWish = () => {
  return async dispatch => {
    /*
    const resp = await postData(
      "http://192.168.100.4:8080/api/v1/projects/Project_1/flags",
      {
        jwtToken:
          "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYWhhaXpoYXJAeWFob28uY29tIiwiZXhwIjoxNTY5NTAwNDkxLCJpYXQiOjE1Njk0ODI0OTF9.vVPTOSTxPHDSN3nzoXgrEvkagvR2J9wCSByvb2CRIoyT4tKMtNDj0aGpst1aeXuOCwHpY8bj_r5qprpE1d7G3Q"
      }
    );
    const resp2 = await JSON.stringify(resp);
    console.log("Response on add wish on : " + JSON.stringify(resp, null, 4));
    console.log("Response on add wish on : " + JSON.stringify(resp2, null, 4));
*/ dispatch(
      { type: "ADD_WISH", payload: "Internet Surfing" }
    );
  };
};

async function postData(url = "", data = {}) {
  // Default options are marked with *

  //prev token
  //eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYWhhaXpoYXJAeWFob28uY29tIiwiZXhwIjoxNTY5NTAwNDkxLCJpYXQiOjE1Njk0ODI0OTF9.vVPTOSTxPHDSN3nzoXgrEvkagvR2J9wCSByvb2CRIoyT4tKMtNDj0aGpst1aeXuOCwHpY8bj_r5qprpE1d7G3Q
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0c2hhaGFiQGNyb3ZhdGVvZmZzaG9yZS5jb20iLCJleHAiOjE1Njk1MDU3NDgsImlhdCI6MTU2OTQ4Nzc0OH0.hR_CHxVPDarV6Vf4iL_Ar4juuVETzTHAUvTYRmFUqfucB4MRLKo-VOGZyOsVoRzt27lsAtPbZXd0tZMJlPog_g",
      "Content-Type": "application/json"
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // no-referrer, *client
    body: JSON.stringify({
      key: "new-gallery",
      name: "New Gallery",
      description: "feature flag 1",
      flagType: "BOOLEAN",
      variations: [
        {
          key: "v1",
          name: "control",
          description: "variation 1"
        },
        {
          key: "v2",
          name: "treatment",
          description: "variation 2"
        }
      ]
    }) // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

export const ChangeInputBoxValue = event => {
  return dispatch => {
    dispatch({ type: "CHANGE_INPUTBOX", payload: event.target.value });
  };
};
