import axios from "axios";

export default function randomFunction() {
  console.log("RANDOM DEFUALT FUNCTION RUN");
}

//ACTION IS OBJECT WITH TYPE AND PAYLOAD PARAMETERS
//this funct is an action creatore - returns an objct called an action
export const selectUser = user => {
  console.log("Click on user: ", user.first);

  var fetchedData = { latitude: "", longitude: "" };

  //1 fetch the data
  //action is passed to a reducer!
  //where based on type,
  //payload data ie the user is refined

  fetch(
    "https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22"
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(myJsonData) {
      console.log(JSON.stringify(myJsonData));
      console.log("Longitude Data: " + JSON.stringify(myJsonData.coord.lon));
      console.log("Latitude Data: " + JSON.stringify(myJsonData.coord.lat));

      //Updating our data object with the fetched Data
      fetchedData.longitude = JSON.stringify(myJsonData.lon);
      fetchedData.latitude = JSON.stringify(myJsonData.lat);
    });

  //2 return an action
  /*
  return {
    type: "USER_SELECTED",
    payload: user
  };
*/
  console.log("long: " + fetchedData.longitude);
  console.log("lat: " + fetchedData.latitude);

  return {
    type: "fetchedData",
    payload: fetchedData
  };
};

export const UpdateInputState = (currentState, inputType) => {
  console.log("INSIDE UpdateInputState aftter onchange");
  if (inputType == "email") {
    console.log("update state condition meets for email");

    return {
      type: "INPUT_STATE_UPDATE",
      payload: { SignUpEmail: currentState }
    };
  } else if (inputType == "name") {
    return {
      type: "INPUT_STATE_UPDATE",
      payload: { SignUpName: currentState }
    };
  } else if (inputType == "pass") {
    return {
      type: "INPUT_STATE_UPDATE",
      payload: { SignUpPass: currentState }
    };
  }
};

//const apiUrl = "https://api.github.com/users/KrunalLathiya";

export const fetchMyWeatherData = () => {
  return dispatch => {
    dispatch({
      type: "FETCH_WEATHER_DATA"
    });
    console.log("FETCH WEATHER FUNC RUN");
    var fetchedData = {
      latitude: "",
      longitude: ""
    }; /*
        let json = response.json();
        if (response.status >= 200 && response.status < 300) {
          return json;
        } else {
          return json.then(Promise.reject.bind(Promise));
        }
        */
    //1 fetch the data
    //action is passed to a reducer!
    //where based on type,
    //payload data ie the user is refined
    /*
    fetch(
      "https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22"
    )
      .then(async response => {
        return await response.json();
    */
    //  })
    //  .then(async myJsonData => {
    /*
          if (myJsonData.result && myJsonData.result.status === "error") {
          } else {
          }
  */
    /*
        console.log(JSON.stringify(myJsonData));
        console.log("Longitude Data: " + JSON.stringify(myJsonData.coord.lon));
        console.log("Latitude Data: " + JSON.stringify(myJsonData.coord.lat));
  
        //Updating our data object with the fetched Data
        fetchedData.longitude = await JSON.stringify(myJsonData.lon);
        fetchedData.latitude = await JSON.stringify(myJsonData.lat);
        console.log("Variable set for fetchData");
        return await fetchedData;
      })
      .then(async fetchedData => {
        return await fetchData(fetchedData);
      })
      .then(async data => {
        return await data;
      })
      .catch(async error => {
        throw await error;
      });
  */

    /*
    return axios
      .get(
        "https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22"
      )
      .then(res => {
        res.json();
      })
      .then(data =>
        dispatch({
          type: "FETCH_WEATHER_DATA",
          payload: data.data.coord.lat
        })
      )
      .catch(error => {
        dispatch({
          type: "FETCH_WEATHER_DATA_FAILED",
          payload: error
        });
        // throw error;
      });
    */
    return dispatch({
      type: "",
      payload: {}
    });
  };
};

/*
export function XselectUser(user) {
  return (dispatch, getState) => {
    console.log(getState());

    fetch(
      "https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22",
      {
        mode: "no-cors"
      }
    ).then(dispatch(selectUser(user)));
  };
}
*/

/**
 *
 export function fetchOffers() {
  return function action(dispatch) {
    dispatch({ type: FETCH_OFFERS })

    const request = axios({
      method: 'GET',
      url: `${BASE_URL}/offers`,
      headers: []
    });

    return request.then(
      response => dispatch(fetchOffersSuccess(response)),
      err => dispatch(fetchOffersError(err))
    );
  }
}
 */
