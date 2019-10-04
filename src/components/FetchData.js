import React, { Component } from "react";
class DataFetching extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      weather: null
    };
  }

  async componentDidMount() {
    //const url = "https://api.randomuser.me/";
    const url =
      "https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22";
    //await waits for getting all data
    const response = await fetch(url);
    const data = await response.json();
    console.log("DATA FETCH FROM URL: \n\n" + data);
    // console.log("DATA FETCH FROM URL [results 0]: \n\n" + data.results[0]);
    this.setState({ weather: data.coord, loading: false }, () => {
      console.log("FIRST PERSON: \n\n" + this.state.weather);
    });
  }
  render() {
    return (
      <div>
        {this.state.loading || !this.state.weather ? (
          <div>loading...</div>
        ) : (
          <div>
            <h1>DATA RETRIEVED FROM WEATHER API</h1>
            <h2>
              Longitude:
              {this.state.weather.lon}, Latitude: {this.state.weather.lat}
            </h2>
          </div>
        )}
      </div>
    );
  }
}

export default DataFetching;
