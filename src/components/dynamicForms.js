import React, { Component } from "react";
import Switch from "react-switch";
//import Button from "react-bootstrap/Button"; //v3 bootstrap
import Autosuggest from "react-autosuggest";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import {
  withFormik,
  Formik,
  ErrorMessage,
  FormikProps,
  Form,
  Field,
  FieldArray
} from "formik";
import * as Yup from "yup";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";

const FeatureCreateSchema = Yup.object().shape({
  featureName: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  featureKey: Yup.string()
    .required("Required")
    .min(2, "Too Short!")
    .max(70, "Too Long!"),
  featureDesc: Yup.string()
    .min(6, "Too Short!")
    .required("Required"),
  TemporaryVariations: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .min(4, "    Variation Name too short")
        .required("    Name Required"),
      key: Yup.string()
        .min(4, "    Variation Key too short")
        .required("    Variation Key Required"), // these constraints take precedence

      description: Yup.string()
        .min(4, "    Variation Description too short")
        .required("    Variation Description Required") // these constraints take precedence
    })
  ),
  friends: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string()
          .min(4, "Name too short")
          .required("Name Required"), // these constraints take precedence
        age: Yup.string()
          .min(3, "Age too short")
          .required("Age Required") // these constraints take precedence
      })
    )
    .required("Submission Error - Must have friends") // these constraints are shown if and only if inner constraints are satisfied
    .min(3, "Submission Error - Minimum of 3 friends")
});

/* ARRAY OF OBJECTS FOR SEARCHING A FEATURES - AUTO-SUGGESTION */
var featuresList = new Array(
  {
    name: "Feature 1",
    description: "National University"
  },
  {
    name: "Feature 2",
    description: "Aeroplane parts 2"
  },
  {
    name: "Feature 3",
    description: "Uber"
  },
  {
    name: "Feature 4",
    description: "Careem"
  },
  {
    name: "Feature 7",
    description: "BONUT"
  },
  {
    name: "Feature 10",
    description: "Car axle"
  },
  {
    name: "Feature 12",
    description: "AMAZING"
  }
);

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
        "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ3YWxlZWRraGFuLndrOTc2QGdtYWlsLmNvbSIsImV4cCI6MTU2OTUxNDk1OCwiaWF0IjoxNTY5NDk2OTU4fQ.ffqocveVghznttuz1dZFEAj3mtshkd0hUTFmfGKqx2HIbJsyfGvcIFFz3sb2vwO8h8KHujBiJOHKhlPeP9geGA",
      "Content-Type": "application/json"
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

/** THE BASIC FILTERATION OF SUGGESTION IS DONE HERE - AUTO - SUGGESTION */
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  /* If its an empty string so return empty array 
     that wont render else put a filter */
  return inputLength === 0
    ? []
    : featuresList.filter(
        specificFeature =>
          specificFeature.name.toLowerCase().slice(0, inputLength) ===
          inputValue
      );
};

//RETURNS WHATEVER IS TO BE INSERTED IN THE SEARCH TEXT BOX,
//AFTER CLICKING ON ONE OF THE OPTIONS AS CHOSING - AUTO-SUGGESTION

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

//HOW IT SHOWS/RENDERS THE LIST CALLED featureList IN DROP DOWN - AUTO-SUGGESTION
const renderSuggestion = suggestion => (
  <div>
    <h5>{suggestion.name}</h5>
    <p>{suggestion.description}</p>
  </div>
);

class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      featureFlag: [
        {
          key: "",
          name: "Feature 1",
          description: "Description of the Feature",
          switchOn: false,
          Variation: [
            {
              key: "",
              name: "",
              description: ""
            }
          ]
        }
      ],
      TemporaryVariations: [
        {
          key: "",
          name: "",
          description: ""
        }
      ],

      temp_featurename: "",
      temp_featurekey: "",
      temp_featuredesc: "",
      temp_featureboolean: "",
      temp_bool_on_true: false,
      temp_bool_off_true: true,
      dropdownOpen: false,
      //max index reached by a variation
      currentTempVarIDX: 0,
      searchedFeatureIndexes: [],
      searchText: "",
      renderSearch: false,
      //MAX ID REACHED IS A TOTALLY JUSTIFIED VARIABLE,
      //SINCE IT SHOULD BE OUTSIDE OF THE BOX
      //THE ID(s) in an array are automaically mapped as indexes
      //so we never needed an id variable inside the featureFlag array's object.
      //EVERY FEATURE IS MAPPED TO AN INDEX ie an id automatically.
      //SO its a waste of storage and slows the app based on N number of maxId reached
      //for each array index. since it should have a single counter variable,
      //not N variable for N items of dynamic array
      maxIDreached: 1,
      /* Auto Suggestion */
      suggestions: [],
      modal: false
    };

    /* function binding */
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.SearchNow = this.SearchNow.bind(this);
    this.addFeature = this.addFeature.bind(this);
    this.searchTheArray = this.searchTheArray.bind(this);
    this.onFormSubmitMark = this.onFormSubmitMark.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.tempvarvalueOnChange = this.tempvarvalueOnChange.bind(this);
    this.tempkeyvalueOnChange = this.tempkeyvalueOnChange.bind(this);
    this.tempdescvalueOnChange = this.tempdescvalueOnChange.bind(this);
    this.addVariation = this.addVariation.bind(this);
    this.featureNameChange = this.featureNameChange.bind(this);
    this.featureKeyChange = this.featureKeyChange.bind(this);
    this.featureDescChange = this.featureDescChange.bind(this);
    this.featureBooleanChange = this.featureBooleanChange.bind(this);
    this.toggleForDropDown = this.toggleForDropDown.bind(this);
  }

  /*     {
  jwtTokenPrevious:
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYWhhaXpoYXJAeWFob28uY29tIiwiZXhwIjoxNTY5NTAwNDkxLCJpYXQiOjE1Njk0ODI0OTF9.vVPTOSTxPHDSN3nzoXgrEvkagvR2J9wCSByvb2CRIoyT4tKMtNDj0aGpst1aeXuOCwHpY8bj_r5qprpE1d7G3Q"
}
*/

  /*
  async componentWillMount() {
    console.log("RUNNING COMPONENT WILL MOUNT");
    console.log("FETCHING DATA");
    const resp = await postData(
      "http://192.168.100.140:8080/api/v1/projects/pjt17/flags"
    );

    if (resp.status.code == 500) {
      console.log(
        "Unique key constraint: Duplicate key for projects being added!. Please change the key provided"
      );
    } else {
      console.log(
        "Response on Data Fetch [Waleed's Data] : " +
          JSON.stringify(resp, null, 4)
      );
    }
  }
  */

  /**
 * REAL OBJECT
             {
           key: "",
          name: "",
          description: ""
            }
 */

  tempvarvalueOnChange(idx) {
    this.state.TemporaryVariations[idx].name = window.event.target.value;
    this.forceUpdate();
  }
  tempkeyvalueOnChange(idx) {
    this.state.TemporaryVariations[idx].key = window.event.target.value;
    this.forceUpdate();
  }
  tempdescvalueOnChange(idx) {
    this.state.TemporaryVariations[idx].description = window.event.target.value;
    this.forceUpdate();
  }

  //TOGGLE IS A FUNCTION THAT SHOWS A NEW Window and hides it
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it. - AUTO-SUGGESTION
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  // - AUTO-SUGGESTION
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  /* 5 functions */

  //switch toggle
  handleSwitchChange = (idx, checked) => {
    console.log("\n\n");
    console.log("Handle switch change at id: " + idx);
    console.log("previous state: " + checked);

    let featureFlag = [...this.state.featureFlag];
    featureFlag[idx]["switchOn"] = !checked;
    this.setState({ featureFlag }, () => {
      console.log("SWITCH VALUE CHANGE: " + !checked);
      console.log("\n\n");
    });
  };

  toggleForDropDown() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  //switch toggle
  handleVariationChange = (idx, checked) => {
    console.log("\n\n");
    console.log("Handle variation change at id: " + idx);
    console.log("previous state: " + checked);

    let variationItem = [...this.state.variationItem];
    variationItem[idx]["switchOn"] = !checked;
    this.setState({ variationItem }, () => {
      console.log("SWITCH VALUE CHANGE: " + !checked);
      console.log("\n\n");
    });
  };

  //data in search text change
  onChange = (event, { newValue }) => {
    console.log("\n\n");

    this.setState(
      {
        searchText: newValue.toUpperCase()
      },
      e => {
        //CONDITION TO MAKE RENDER SEARCH false
        if (this.state.searchText === "") {
          this.setState({ renderSearch: false });
        }

        //Refined array by searching - backend
        this.searchTheArray();

        console.log("\n\n");
      }
    );
  };

  //function called when a new component is added as well as when onChange takes place
  searchTheArray() {
    console.log("Search array worked");
    console.log("Initializing search array to null for a new search query");
    this.setState({ searchedFeatureIndexes: [] }, () => {
      console.log("Search Array [] is: " + this.state.searchedFeatureIndexes);
      console.log("SEARCHING AND ITERATING INDEXES");
      this.state.featureFlag.map((val, idx) => {
        if (
          this.state.featureFlag[idx].name
            .toUpperCase()
            .startsWith(this.state.searchText) &&
          this.state.searchText != ""
        ) {
          this.state.searchedFeatureIndexes.push(idx);
          //LETTING AS A STATE
          let searchedFeatureIndexes = [...this.state.searchedFeatureIndexes];
          this.setState({ searchedFeatureIndexes }, () => {
            console.log(
              "\nINDEX ADDED FOR SEARCH: " +
                this.state.searchText +
                " which is located at index: " +
                idx
            );
          });
        } else {
          console.log("INDEX <NOT> ADDED FOR SEARCH: " + idx);
        }
        console.log(
          "Search Array on LOOP: " + this.state.searchedFeatureIndexes
        );
      });
      console.log(
        "\n\nFINAL Search Array: " + this.state.searchedFeatureIndexes
      );
    });
  }

  //Search button click - Makes renderSearch True
  SearchNow = e => {
    console.log("\n\n");
    console.log("SEARCH CLICKED");
    if (this.state.searchText === "") {
      console.log("SEARCH BOX EMPTY");
      this.setState({ renderSearch: false });
    } else {
      console.log("SEARCH BOX NOT EMPTY, WE CAN SEARCH");
      console.log("Search Text: " + this.state.searchText);
      //RENDER ACCORDING TO SEARCH TEXT
      this.setState({ renderSearch: true }, () => {
        console.log("RENDERING ACCORDING TO SEARCH TEXT");
        this.searchTheArray();
        console.log("SEARCH ENDED");
        console.log("\n\n");
      });
    }
    e.preventDefault();
  };

  //works to update the recommendation features added up till now
  updateRecommender() {
    var lastFeatureIndex = this.state.featureFlag.length - 1;
    var name = this.state.featureFlag[lastFeatureIndex].name;
    var description = this.state.featureFlag[lastFeatureIndex].description;
    var obj = { name, description };
    featuresList.push(obj);
  }

  //adds a new feature
  addFeature = () => {
    console.log("\n\n");
    console.log("Feature ADDED");
    /**
 OBJECT TYPE
 {
      key: "new-gallery010d",
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
    }
 */
    //ON the backend, the feature are starting from index 0 and onwards,
    //ON the frontend, the feature are starting from index 1 and onwards,
    this.setState(
      prevState => ({
        featureFlag: [
          ...prevState.featureFlag,
          {
            key: "Key - " + this.state.temp_featurekey,
            name:
              "Feature " +
              (this.state.maxIDreached + 1) +
              " - " +
              this.state.temp_featurename,
            description: "Description - " + this.state.temp_featuredesc,
            switchOn: false,
            Variation: this.state.TemporaryVariations
          }
        ]
      }),
      async () => {
        console.log(
          "Feature object on New Add: " +
            JSON.stringify(this.state.featureFlag, null, 4)
        );

        //updates the recommended searching box by adding 1 feature at the bottom
        this.updateRecommender();

        //create object in Server's DB
        console.log("RUNNING CREATE OBJECT TO JAVA SERVER");
        console.log("FETCHING DATA");
        const userData = {
          key: "Key - " + this.state.temp_featurekey,
          name:
            "Feature " +
            (this.state.maxIDreached + 1) +
            " - " +
            this.state.temp_featurename,
          description: "Description - " + this.state.temp_featuredesc,
          flagType: this.state.temp_featureboolean,
          variations: this.state.TemporaryVariations
        };
        //reponse -
        const resp = await postData(
          "http://192.168.100.140:8080/api/v1/projects/pjt17/flags",
          userData
        );

        if (resp.status.code == 500) {
          console.log(
            "ERROR TO DB: Unique key constraint: Duplicate key for projects - Response: " +
              JSON.stringify(resp, null, 4)
          );
          alert("DUPLICATE DATA! PLEASE CHANGE FLAG KEY PROVIDED");
        } else if (resp.status.code == 401) {
          console.log(
            "ERROR TO DB:Unauthorized - Response: " +
              JSON.stringify(resp, null, 4)
          );
          alert("UNAUTHORIZED");
        } else {
          console.log(
            "DATA TO DB: Response on Data Fetch [Waleed's Data] : " +
              JSON.stringify(resp, null, 4)
          );
          alert("FLAG INSERTED TO DATABASE");
        }
      }
    );

    //Initialize to initial for new temp object
    this.setState({
      TemporaryVariations: [
        {
          key: "",
          name: "",
          description: ""
        }
      ]
    });

    //new feature has been added to array
    //now again apply search criteria to match all feature items that
    //exist within the array with the current UI/VIEW - RUNS searchTheArray function
    this.searchTheArray();
    //increment counter of max number of features reached by 1.
    this.setState({ maxIDreached: this.state.maxIDreached + 1 }, () => {
      console.log("Max Feature reached: " + this.state.maxIDreached + "\n\n");
    });

    this.toggle();
  };

  addVariation = () => {
    console.log("\n\n");
    console.log("Temporary Variations ADDED");

    //ON the backend, the feature are starting from index 0 and onwards,
    //ON the frontend, the feature are starting from index 1 and onwards,
    this.setState(prevState => ({
      TemporaryVariations: [
        ...prevState.TemporaryVariations,
        {
          key: "",
          name: "",
          description: ""
        }
      ]
    }));
    this.state.currentTempVarIDX = this.state.currentTempVarIDX + 1;
    this.forceUpdate();
    console.log("\n\n");
  };
  //prevents loading when enter pressed randomly by the user
  //even without doing anything
  onFormSubmitMark = e => {
    e.preventDefault();
  };

  featureNameChange(props) {
    props.setFieldValue("featureName", window.event.target.value);
    this.state.temp_featurename = window.event.target.value;
    this.forceUpdate();
  }
  featureKeyChange(props) {
    props.setFieldValue("featureKey", window.event.target.value);
    this.state.temp_featurekey = window.event.target.value;
    this.forceUpdate();
  }
  featureDescChange(props) {
    props.setFieldValue("featureDesc", window.event.target.value);
    this.state.temp_featuredesc = window.event.target.value;
    this.forceUpdate();
  }

  featureBooleanChange(e) {
    this.setState({ temp_featureboolean: e.currentTarget.textContent }, () => {
      console.log("BOOLEAN: " + this.state.temp_featureboolean);
      if (this.state.temp_featureboolean === "ON") {
        this.setState({ temp_bool_on_true: true });
        this.setState({ temp_bool_off_true: false });
      } else if (this.state.temp_featureboolean === "OFF") {
        this.setState({ temp_bool_on_true: false });
        this.setState({ temp_bool_off_true: true });
      }
    });
  }
  render() {
    //TAKE required states
    //the item boxes of feautures complete object,
    //the search box input,
    //and the suggestions list array. It is refined later by
    //search criteria to render the list
    const props = this.props;
    let {
      searchText,
      featureFlag,
      suggestions,
      TemporaryVariations
    } = this.state;
    //renderSearch is a state that only run if the specific value
    //is false else maximum update depth causes an error
    //So the first condition handles the infinite setState exception
    //beforehand
    if (this.state.renderSearch && this.state.searchText === "") {
      this.setState({ renderSearch: false });
    } else if (!this.state.renderSearch && this.state.searchText !== "") {
      this.setState({ renderSearch: true });
    }

    //Auto-suggest will pass through all these props to the input ie
    //all of these as additional props are added to  <Autosuggest    >
    //tag - AUTO-SUGGESTION
    const inputProps = {
      name: "searchText",
      placeholder: "Find the Feature Flag",
      value: searchText,
      onChange: this.onChange,
      id: "searchText",
      className: "searchText",
      class: "col-md-11"
    };

    return (
      <div>
        {/** HEADER SECTION still to be done */}
        {/*      <div class="bg-info text-dark" style={{ display: "inline" }}>
          <header>
            <h1>FEATURE FLAGS</h1>
            <h3>Projects ^</h3>
            <h3>Notification Bell</h3>
             <img src="cinqueterre.jpg" class="rounded-circle" alt="Display Picture">
            <h3>Usman Khan</h3>
          </header>
        </div>
*/}
        {/* Redux form */}
        <h1>Redux Form</h1>
        {/*        <form
          class="bg-light text-dark mt-0 pt-0"
          onSubmit={this.onFormSubmitMark}
        >
*/}{" "}
        <div class="container pt-5 pb-5">
          <h1>Feature Flags</h1>
          <div>
            <p style={{ display: "inline" }}>
              Use this page to see all the Feature Flags in this project. Select
              a Flag to manage the environment-specific targetting and rollout
              rules. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
            </p>
            <Button color="danger" onClick={this.toggle}>
              NEW+
            </Button>{" "}
            <div>
              <Formik
                initialValues={{
                  featureName: "",
                  featureKey: "",
                  featureDesc: "",
                  TemporaryVariations: this.state.TemporaryVariations,
                  friends: [{ name: "ali", age: "4" }]
                }}
                validationSchema={FeatureCreateSchema}
                onSubmit={(values, actions) => {
                  console.log("FORMIK FORM - Inside submit click");
                  setTimeout(() => {
                    //  alert("Your Input: " + JSON.stringify(values, null, 2));
                    console.log(
                      "FORMIK FORM - " + JSON.stringify(values, null, 2)
                    );
                    actions.setSubmitting(false);
                  }, 1000);
                }}
                render={({ values }) => (
                  <Form onSubmit={props.handleSubmit}>
                    <h1>Field Array</h1>
                    <FieldArray
                      name="friends"
                      render={arrayHelpers => (
                        <div>
                          {values.friends.map((friend, index) => (
                            <div key={index}>
                              <Field name={`friends[${index}].name`} />
                              <Field name={`friends.${index}.age`} />
                              <button
                                type="button"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                -
                              </button>
                              <ErrorMessage name={`friends[${index}].name`} />
                              <ErrorMessage name={`friends[${index}].age`} />
                            </div>
                          ))}
                          <br></br>
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.push({ name: "", age: "" })
                            }
                          >
                            +
                          </button>
                          <br></br>
                        </div>
                      )}
                    />
                    <h1>End Field Array</h1>
                    <Modal
                      centered
                      aria-hidden="true"
                      class="modal fade"
                      isOpen={this.state.modal}
                      toggle={this.toggle}
                      className={this.props.className}
                    >
                      <ModalHeader toggle={this.toggle}>
                        Create Feature Flag
                      </ModalHeader>
                      <ModalBody>
                        <label>Name</label>
                        <br></br>
                        <Field
                          name="featureName"
                          type="text"
                          placeholder="Enter Feature Name"
                          onBlur={props.handleBlur}
                          style={{ width: 350 }}
                          onChange={() => this.featureNameChange(props)}
                        />
                        <ErrorMessage name="featureName" />
                        <br />
                        <label>Key</label>
                        <br></br>
                        <Field
                          name="featureKey"
                          type="text"
                          placeholder="Enter key for flag"
                          onBlur={props.handleBlur}
                          style={{ width: 350 }}
                          onChange={() => this.featureKeyChange(props)}
                        />
                        <ErrorMessage name="featureKey" />
                        <br />
                        <label>Descriptions</label>
                        <br></br>
                        <Field
                          name="featureDesc"
                          type="text"
                          placeholder="Enter description"
                          onBlur={props.handleBlur}
                          style={{ width: 350 }}
                          onChange={() => this.featureDescChange(props)}
                        />
                        <ErrorMessage name="featureDesc" />
                        <br />
                        <label>Variations</label>
                        <Dropdown
                          isOpen={this.state.dropdownOpen}
                          toggle={this.toggleForDropDown}
                        >
                          <DropdownToggle caret>
                            BOOLEAN{" "}
                            {this.state.temp_featureboolean === ""
                              ? "..."
                              : this.state.temp_featureboolean}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header disabled>
                              TURN ON OR OFF
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem
                              onClick={this.featureBooleanChange}
                              active={this.state.temp_bool_on_true}
                            >
                              ON
                            </DropdownItem>
                            <DropdownItem
                              onClick={this.featureBooleanChange}
                              active={this.state.temp_bool_off_true}
                            >
                              OFF
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>{" "}
                        <br />
                        <FieldArray
                          name="TemporaryVariations"
                          render={arrayHelpers => (
                            <div>
                              {values.TemporaryVariations.map((val, idx) => {
                                let variationsId = `variation-${idx}`,
                                  keysId = `key-${idx}`,
                                  descriptionsId = `description-${idx}`;
                                return (
                                  <div
                                    key={idx}
                                    class="pagination-centered bg-white text-dark mr-2 mb-5 pb-5 "
                                  >
                                    <div>
                                      <label className="col-md-5" id={idx}>
                                        Variation {idx + 1}
                                      </label>
                                      <label className="col-md-4" id={idx}>
                                        Key
                                      </label>
                                      <label className="col-md-3" id={idx}>
                                        Description
                                      </label>
                                    </div>{" "}
                                    <div style={{ display: "inline" }}>
                                      {/*
                                <Input
                                  style={{ display: "inline" }}
                                  className="col-md-5"
                                  value={
                                    this.state.TemporaryVariations[idx]
                                      .name
                                  }
                                  onChange={() => {
                                    this.tempvarvalueOnChange(idx);
                                  }}
                                  id={variationsId}
                                  placeholder={"Variation " + (idx + 1)}
                                />
                                */}
                                      <Field
                                        name={`TemporaryVariations[${idx}].name`}
                                        type="text"
                                        placeholder={"Variation " + (idx + 1)}
                                        onBlur={props.handleBlur}
                                        id={variationsId}
                                        style={{ display: "inline" }}
                                        className="col-md-5"
                                        value={
                                          this.state.TemporaryVariations[idx]
                                            .name
                                        }
                                        onChange={() => {
                                          this.tempvarvalueOnChange(idx);
                                        }}
                                      />
                                      <Field
                                        name={`TemporaryVariations[${idx}].key`}
                                        type="text"
                                        placeholder="Key"
                                        onBlur={props.handleBlur}
                                        style={{ display: "inline" }}
                                        className="col-md-4"
                                        value={
                                          this.state.TemporaryVariations[idx]
                                            .key
                                        }
                                        onChange={() => {
                                          this.tempkeyvalueOnChange(idx);
                                        }}
                                        id={keysId}
                                      />
                                      <Field
                                        name={`TemporaryVariations[${idx}].description`}
                                        type="text"
                                        style={{ display: "inline" }}
                                        className="col-md-3"
                                        value={
                                          this.state.TemporaryVariations[idx]
                                            .description
                                        }
                                        onChange={() => {
                                          this.tempdescvalueOnChange(idx);
                                        }}
                                        id={descriptionsId}
                                        placeholder="Enter ... "
                                      />{" "}
                                      <button
                                        type="button"
                                        onClick={() => arrayHelpers.remove(idx)}
                                      >
                                        Remove Variation
                                      </button>
                                      <br></br>
                                      <ErrorMessage
                                        name={`TemporaryVariations[${idx}].name`}
                                      />
                                      <ErrorMessage
                                        name={`TemporaryVariations[${idx}].key`}
                                      />
                                      <ErrorMessage
                                        name={`TemporaryVariations[${idx}].description`}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                              <br></br>
                              <button
                                type="button"
                                onClick={() =>
                                  arrayHelpers.push(this.state.TemporaryVariations)
                                }
                              >
                                +
                              </button>
                              <br></br>
                              <Button onClick={this.addVariation}>
                                +Add Variation
                              </Button>{" "}
                              <br></br>
                            </div>
                          )}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={this.addFeature}>
                          SUBMIT
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </Form>
                )}
              />
            </div>
          </div>
          <br></br>
          <br></br>
          {/** WHITE AREA STARTS */}
          <div class="row pb-4 pt-5 bg-white text-dark">
            <div class="col-md-11">
              {/*  - AUTO-SUGGESTION  */}
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
              />
            </div>
            <div class="col-md-1">
              <Button
                class="col-md-1"
                onClick={this.SearchNow}
                style={{ height: "40px" }}
              >
                <img src="https://img.icons8.com/material/24/000000/search--v1.png" />
              </Button>
            </div>{" "}
          </div>

          {/***
           *
           * FIRST CONDTION MEET - NO Search text
           *
           */}
          {!this.state.renderSearch ? (
            <div class="row pagination-centered bg-white text-dark mb-5 pb-5">
              {/** MAPPING */}
              {featureFlag.map((val, idx) => {
                let featureId = `feature-${idx}`,
                  descriptionId = `description-${idx}`,
                  switchOnId = `switch-${idx}`;
                return (
                  <div key={idx} class="mr-0 mb-5 col-md-3">
                    {/** BORDER STARTS */}
                    <div
                      class="col border border-dark"
                      style={{ height: "120px" }}
                    >
                      {/** COMPOENNT WITHIN WHOLE BORDER STARTS */}
                      <div id="WHOLE_COMPONENT_TO_RENDER" class="row">
                        {/** FEATURE NO with color*/}
                        <label
                          htmlFor={featureId}
                          class="bg-secondary text-white col-md-12"
                        >
                          <label class="pr-5 mt-1 pt-0">
                            {this.state.featureFlag[idx].name}
                          </label>
                          {/** SWITCH LABEL */}
                          <label
                            class="pt-2 mt-2 mr-0 pr-0 "
                            style={{ width: "0px" }}
                          >
                            <div>
                              <Switch
                                name={switchOnId}
                                id={switchOnId}
                                idx={idx}
                                data_id={idx}
                                className="switchOn"
                                checked={featureFlag[idx].switchOn}
                                onChange={() =>
                                  this.handleSwitchChange(
                                    idx,
                                    featureFlag[idx].switchOn
                                  )
                                }
                              />
                            </div>
                          </label>
                        </label>
                        {/** COLOR BLACK of heading of feature item ENDS HERE */}
                        <br />

                        {/** LABEL FOR DESCRIPTION of feature item*/}
                        <label class="pl-3" htmlFor={descriptionId}>
                          {this.state.featureFlag[idx].description}
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              {/***
               *
               * SECOND CONDTION - A search text exists SO we will render accordingly
               *
               */}
              <div class="row pagination-centered bg-white text-dark mb-5 pb-5">
                {/** MAPPING */}
                {this.state.searchedFeatureIndexes.map((val, idx) => {
                  let featureId = `feature-${val}`,
                    descriptionId = `description-${val}`,
                    switchOnId = `switch-${val}`;
                  return (
                    <div key={idx} class="mr-0 mb-5 col-md-3">
                      {/** BORDER STARTS */}
                      <div
                        class="col border border-dark "
                        style={{ height: "120px" }}
                      >
                        {/** COMPOENENT WITHIN WHOLE BORDER STARTS */}
                        <div id="WHOLE_COMPONENT_TO_RENDER" class="row">
                          {/** FEATURE NO with color*/}
                          <label
                            htmlFor={featureId}
                            class="bg-secondary text-white col-md-12"
                          >
                            <label class="pr-5 mt-1 pt-0">
                              {this.state.featureFlag[val].name}
                            </label>
                            {/** SWITCH LABEL */}
                            <label
                              class="pt-2 mt-2 mr-0 pr-0 "
                              style={{ width: "0px" }}
                            >
                              <div>
                                <Switch
                                  name={switchOnId}
                                  id={switchOnId}
                                  idx={val}
                                  data_id={val}
                                  className="switchOn"
                                  checked={featureFlag[val].switchOn}
                                  onChange={() =>
                                    this.handleSwitchChange(
                                      val,
                                      featureFlag[val].switchOn
                                    )
                                  }
                                />
                              </div>
                            </label>
                          </label>
                          {/** COLOR BLACK ENDS HERE */}
                          <br />

                          {/** LABEL FOR DESCRIPTION*/}
                          <label class="pl-3" htmlFor={descriptionId}>
                            {this.state.featureFlag[val].description}
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MyForm;
