export default function() {
  //returns an array of 3 users(SAVED AS JSON OBJECTS EACH)

  return [
    {
      id: 1,
      first: "Talha",
      last: "Shahab",
      age: "23",
      description: "Programmer",
      thumbnail: "http://personal.psu.edu/xqz5228/jpg.jpg"
    },
    {
      id: 2,
      first: "Panda",
      last: "Guy",
      age: "45",
      description: "Fat",
      thumbnail: "https://tinyjpg.com/images/social/website.jpg"
    },
    {
      id: 3,
      first: "Crazy",
      last: "People",
      age: "100",
      description: "Adventurers",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/en/3/3f/Oxalis_tetraphylla_flower.jpg"
    }
  ];
}

/**
 ,
      {
        id: 4,
        first: "Data Fetched ",
        last: "Weather API",
        age: data.coord.lon,
        description: data.coord.lat,
        thumbnail:
          "https://upload.wikimedia.org/wikipedia/en/3/3f/Oxalis_tetraphylla_flower.jpg"
      }
 */
//}

/*
async function dataFetchAsyncCall() {
  console.log("calling");

  //const url = "https://api.randomuser.me/";
  const url =
    "https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22";
  //await waits for getting all data
  const response = await fetch(url);
  const data = await response.json();
  console.log("DATA FETCH FROM URL: \n\n" + data);
  return data;
}
*/

/*

import React, { Component } from "react";
class DataFetching extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: null
    };
  }


 async dataFetchedResult() {
   //const url = "https://api.randomuser.me/";
   const url =
     "https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22";
   //await waits for getting all data
   const response = await fetch(url);
   const data = await response.json();
   console.log("DATA FETCH FROM URL: \n\n" + data);
   // console.log("DATA FETCH FROM URL [results 0]: \n\n" + data.results[0]);
  // this.setState({ weather: data.coord, loading: false }, () => {
   //  console.log("FIRST PERSON: \n\n" + this.state.weather);
  // });
   
    return [
      {
        id: 1,
        first: "Talha",
        last: "Shahab",
        age: "23",
        description: "Programmer",
        thumbnail: "http://personal.psu.edu/xqz5228/jpg.jpg"
      },
      {
        id: 2,
        first: "Panda",
        last: "Guy",
        age: "45",
        description: "Fat",
        thumbnail: "https://tinyjpg.com/images/social/website.jpg"
      },
      {
        id: 3,
        first: "Crazy",
        last: "People",
        age: "100",
        description: "Adventurers",
        thumbnail:
          "https://upload.wikimedia.org/wikipedia/en/3/3f/Oxalis_tetraphylla_flower.jpg"
      },
      {
        id: 4,
        first: "Data Fetched ",
        last: "Weather API",
        age: this.state.weather.lon,
        description: this.state.weather.lat,
        thumbnail:
          "https://upload.wikimedia.org/wikipedia/en/3/3f/Oxalis_tetraphylla_flower.jpg"
      }
    ];
  }
}

export default DataFetching;
*/
