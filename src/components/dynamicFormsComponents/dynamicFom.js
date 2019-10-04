import React, { Component } from "react";
import Switch from "react-switch";
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
}
    from "formik";
import * as Yup from "yup";
import axios from "axios";

/* Redux */
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { featureFlagSubmitState } from '../../action/featureFlagSubmitState';


const FeatureCreateSchema = Yup.object().shape({
    featureName: Yup.string()
        .min(1, "Name Too Short!")
        .max(70, "Name Too Long!")
        .required("Name Required"),
    featureKey: Yup.string()
        .required("Key Required")
        .min(1, "Key Too Short!")
        .max(70, "Key Too Long!"),
    featureDesc: Yup.string()
        .min(1, "Description Too Short!")
        .required("Description Required"), 
    temp_featureboolean: Yup.string()
    //        .required("Please Select Switch On/Off")
    ,
    TemporaryVariations: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Name Required"),
            key: Yup.string().required("Key Required"),
            description: Yup.string().required("Description Required\n")
        })
    ),

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
   const response = await fetch(url, { 
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {  
            Authorization:
              "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjb21wcmVoZW5zaXZlcGhyYXNlQGdtYWlsLmNvbSIsImV4cCI6MTU3MDAyOTk3MCwiaWF0IjoxNTcwMDExOTcwfQ.5nZF6sIn5dXqSi1udgW7y80zzmbTQ7rcv385fLb4BAlftFCHkLxD8Ud-yvZQDwex66DIqpxZY1YqmCRsjyQ-Bw"
            , "Content-Type": "application/json" 
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
                   "key": "v1",
                   "name": "control",
                   "description": "variation 1"
               },
               {
                   "key": "v2",
                   "name": "treatment",
                   "description": "variation 2"
               }
           ]
       }) // body data type must match "Content-Type" header
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
                            name: "Variation Name",
                            key: "key of the Variation",
                            description: "Description of the Variation"
                        }
                    ]
                }
            ],
            TemporaryVariations: [
                {
                    name: "",
                    key: "",
                    description: ""
                }
            ],
            
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
            modal: false,
            temp_featureboolean: "",
            featureName: "",
            featureKey: "",
            featureDesc: ""

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
        this.featureBooleanChange = this.featureBooleanChange.bind(this);
        this.toggleForDropDown = this.toggleForDropDown.bind(this);
    } 

    tempvarvalueOnChange(idx) {
        this.state.TemporaryVariations[idx].name =
            window.event.target.value;
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

    //WORK ON MODAL SHOW HIDE...TOGGLE IS A FUNCTION THAT SHOWS A NEW Window and hides it
    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }
    // Autosuggest will call this function every time you need to update suggestions.
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

    //switch values on front features buttons
    handleSwitchChange = (idx, checked) => {
        console.log("\n\n");
        console.log("Handle switch change at id: " + idx);
        console.log("previous state: " + checked);

        let featureFlag = [...this.state.featureFlag];
        featureFlag[idx]["switchOn"] = !checked;
        this.setState({ featureFlag}, () => {
            console.log("SWITCH VALUE CHANGE: " + !checked);
            console.log("\n\n");
        });
    };

    //Boolean flagtype opens or closes
    toggleForDropDown() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }


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

/** Add a feature */
    addFeature = (resetFormAction) => {
        console.log("\n\n");
        console.log("Feature ADDED");
        //ON the backend, the feature are starting from index 0 and onwards,
        //ON the frontend, the feature are starting from index 1 and onwards,
        console.log("CURRENT STATE: " + JSON.stringify(this.state, null, 4));
           
        /**
        
         */

        var previousState = {};
        this.setState(
            prevState => {
                previousState = prevState;
                return (
                
                    {
                        featureFlag: [
                            ...prevState.featureFlag,
                            {
                                key: "Key - " + this.state.featureKey,
                                name:
                                    "Feature " +
                                    (this.state.maxIDreached + 1) +
                                    " - " +
                                    this.state.featureName,
                                description: "Description - " + this.state.featureDesc,
                                switchOn: this.state.temp_bool_on_true,
                                Variation: this.state.TemporaryVariations
                            }
                        ]
                    })
            },
            async () => {
                console.log(
                    "Feature object on addFeature: " +
                    JSON.stringify(this.state.featureFlag, null, 4)
                );
                //                prevFeatureFlag, featureKey, maxIDreached, featureName, featureDesc, temp_bool_on_true, TemporaryVariations
                //UPDate APPLICATION STATE[ie not local]
                this.props.SubmitFeatureFlagToRedux(previousState, this.state.featureKey, this.state.maxIDreached, this.state.featureName, this.state.featureDesc, this.state.temp_bool_on_true, this.state.TemporaryVariations);

                //updates the recommended searching box by adding 1 feature at the bottom
                this.updateRecommender();

                //create object in Server's DB
                console.log("INITIALIZE OBJECT TO SEND TO SERVER");
                const userData = {
                    key: "Key - " + this.state.featureKey,
                    name:
                        "Feature " +
                        (this.state.maxIDreached + 1) +
                        " - " +
                        this.state.featureName,
                    description: "Description - " + this.state.featureDesc,
                    flagType: this.state.temp_featureboolean,
                    variations: this.state.TemporaryVariations
                };
                //reponse - 
                console.log("FETCHING DATA FROM DATABASE");


                console.log("Before fetch request to waleed");
                const resp = await postData(
                    "http://192.168.100.255:8080/api/v1/projects/pjt1/flags",
                    userData
                );

                console.log("After fetch request to waleed");

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
                }
                else {
                    console.log(
                        "DATA TO DB: Response on Data Fetch [Waleed's Data] : " +
                        JSON.stringify(resp, null, 4)
                    );
                    alert("FLAG INSERTED TO DATABASE");
                }
            }, () => {        //Initialize to initial for new temp object
                this.setState({
                    TemporaryVariations: [
                        {
                            name: "Variation Name",
                            key: "key of the Variation",
                            description: "Description of the Variation"
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
} 
        );


       // resetFormAction.resetForm();
    
        this.toggle();
      //  return window.confirm('Reset?');

    };

    /** Add a variation */
    addVariation = (PropsTemporaryVariations) => {
        console.log("\n\n");
        console.log("Temporary Variations ADDED");

        //ON the backend, the feature are starting from index 0 and onwards,
        //ON the frontend, the feature are starting from index 1 and onwards,
        //variationNo is this.state.currentTempVarIDX,
        PropsTemporaryVariations.push({
            name: "",
            key: "",
            description: ""
        });

        //Update max counter for variations
        this.state.currentTempVarIDX = this.state.currentTempVarIDX + 1;
        this.forceUpdate();
        console.log("\n\n");
    };
    //prevents loading when enter pressed randomly by the user
    //even without doing anything
    onFormSubmitMark = e => {
        e.preventDefault();
    };

    featureBooleanChange(event) {
        console.log("INSIDE FEATURE BOOLEAN CHANGE");
//        console.log("EVENT: " + event);
 //       console.log("EVENT.target: " + event.target);

   //     let nameOfFunction = this[event.target.name];
     //   let arg1 = JSON.stringify(event.target.attributes.props.value); 
       
     //   console.log("Props receved: " + arg1);
      //  console.log("Name OF funct: " + nameOfFunction);
      //  console.log(event.target.getAttribute('active'));
       //     console.log("HERE 1");
            this.setState({ temp_featureboolean: event.currentTarget.textContent }, () => {
            console.log("BOOLEAN Switch to: " + this.state.temp_featureboolean);
            if (this.state.temp_featureboolean === "ON") {
                //event.target.setAttribute("props","ON"); 
                //event show undefined here
                this.setState({ temp_bool_on_true: true }, () => { console.log("SELECTED ON") });
                this.setState({ temp_bool_off_true: false });
            } else if (this.state.temp_featureboolean === "OFF") {
                //event.target.attributes.props.value= "OFF";
                this.setState({ temp_bool_on_true: false }, () => { console.log("SELECTED OFF") });
                this.setState({ temp_bool_off_true: true });
            }
       });
        }; 

    render() {
        //TAKE required states
        //the item boxes of feautures complete object,
        //the search box input,
        //and the suggestions list array. It is refined later by
        //search criteria to render the list
        const props =  this.props;
        console.log("Inside RENDER, Printing props: " + JSON.stringify(props));
        let {
            searchText,
            featureFlag,
            suggestions } = this.state;
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

                <div class="container pt-5 pb-5">
                    <h1>Feature Flags</h1>
                    <div>
                        <p style={{ display: "inline" }}>
                            Use this page to see all the Feature Flags in this project. Select
                            a Flag to manage the environment-specific targetting and rollout
                            rules. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
            </p>
                        <Button color="danger" onClick={this.toggle}>NEW+</Button>{" "}
                        <div> 
                            <Formik 
                                
                                initialValues={this.state}

                                validationSchema={FeatureCreateSchema}
                                onSubmit={(values, actions ) => {
                                    console.log("FORMIK FORM - Inside submit click");
                                    setTimeout(() => {
                                        //  alert("Your Input: " + JSON.stringify(values, null, 2));
                                        console.log(
                                            "FORMIK FORM VALUES : " + JSON.stringify(values, null, 2)
                                        ); 

                                        //boolean value already gets set
                                        this.setState(
                                            {
                                                featureName: values.featureName,
                                                featureKey: values.featureKey,
                                                featureDesc: values.featureDesc,
                                                TemporaryVariations: values.TemporaryVariations
                                            },
                                            () => {
                                                console.log(
                                                    "State after update is: " +
                                                    JSON.stringify(this.state, null, 4)
                                                );
                                                this.addFeature(actions);
                                               
                                                console.log("Actions object: " + JSON.stringify(actions, null, 4));
                                            } 
                                        );

                                        //RESETTING THE FORM
                                        //1 set initial object
                                        var initialObject = {
                                            featureFlag: [
                                                {
                                                    key: "",
                                                    name: "Feature 1",
                                                    description: "Description of the Feature",
                                                    switchOn: false,
                                                    Variation: [
                                                        {
                                                            name: "Variation Name",
                                                            key: "key of the Variation",
                                                            description: "Description of the Variation"
                                                        }
                                                    ]
                                                }
                                            ],
                                            TemporaryVariations: [
                                                {
                                                    name: "",
                                                    key: "",
                                                    description: ""
                                                }
                                            ],
                                            temp_bool_on_true: false,
                                            temp_bool_off_true: true,
                                            dropdownOpen: false,
                                            currentTempVarIDX: 0,
                                            searchedFeatureIndexes: [],
                                            searchText: "",
                                            renderSearch: false,
                                            maxIDreached: 1,
                                            suggestions: [],
                                            modal: false,
                                            temp_featureboolean: "",
                                            featureName: "",
                                            featureKey: "",
                                            featureDesc: ""
                                        };
                                        //2 reset form to initial object
                                        actions.resetForm(initialObject); 
                                        actions.setSubmitting(false);
                                    },1000);
                                }}
                                render={(props, resetForm)  => (
                               
                                        <Modal
                                            centered
                                            aria-hidden="true"
                                            class="modal fade"
                                            isOpen={this.state.modal}
                                            toggle={this.toggle}
                                            className={this.props.className}
                                        >
                                             <Form onSubmit={props.handleSubmit}>
                                            <ModalHeader toggle={this.toggle}>
                                                Create Feature Flag
                                            </ModalHeader>
                                            <ModalBody>
                                                <h5>Name</h5>                                              
                                                <Field
                                                    name="featureName"
                                                    type="text"
                                                    placeholder="Enter Feature Name"
                                                    onBlur={props.handleBlur}
                                                    style={{ width: 350 }}
                                                  
                                                /> <br />
                                                <ErrorMessage style={{ color: 'red' }} name="featureName" />
                                                <br />
                                                <br />
                                                <h5>Key</h5>
                                                <Field
                                                    type="text"
                                                    placeholder="Enter key for flag"
                                                    onBlur={props.handleBlur}
                                                    style={{ width: 350 }}
                                                    name="featureKey"
                                                /><br /><ErrorMessage name="featureKey"/>
                                                <br /><br />
                                                <h5>Descriptions</h5>
                                              
                                                <Field
                                                    name="featureDesc"
                                                    type="text"
                                                    placeholder="Enter description"
                                                    onBlur={props.handleBlur}
                                                    style={{ width: 350 }}
                                                     
                                                /> <br /><ErrorMessage name="featureDesc" />
                                                <br /> <br />
                                                <h5>Variations</h5>
                                                <Dropdown
                                                    isOpen={this.state.dropdownOpen}
                                                    toggle={this.toggleForDropDown}
                                                >
                                                    <DropdownToggle caret>
                                                        BOOLEAN{" "}
                                                        {props.temp_featureboolean === ""
                                                            ? "..."
                                                            : props.temp_featureboolean}
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem header disabled>TURN ON OR OFF</DropdownItem>
                                                        <DropdownItem divider />
                                                        <DropdownItem props={props.values.temp_featureboolean} 
                                                            onClick={this.featureBooleanChange}
                                                            active={this.state.temp_bool_on_true}
                                                        >ON</DropdownItem> 
                                                        <DropdownItem props={props.values.temp_featureboolean}
                                                            onClick={this.featureBooleanChange}
                                                            active={this.state.temp_bool_off_true}
                                                        >OFF</DropdownItem> 
                                                    </DropdownMenu>
                                                </Dropdown> <br />
                                                <ErrorMessage name="temp_featureboolean" />
                                                <br /><br />
                                                {props.values.TemporaryVariations.map((val, idx) => {
                                                    let variationsId = `variation-${idx}`,
                                                        keysId = `key-${idx}`,
                                                        descriptionsId = `description-${idx}`;
                                                    return (
                                                        <div
                                                            key={idx}
                                                            class="pagination-centered bg-white text-dark mr-2 mb-5 pb-5 "
                                                        >
                                                            {/** Labels */}
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
      
                                                                <Field
                                                                    name={`TemporaryVariations[${idx}].name`}
                                                                    type="text"
                                                                    placeholder={"Variation " + (idx + 1)}
                                                                    onBlur={props.handleBlur}
                                                                    id={variationsId}
                                                                    style={{ display: "inline" }}
                                                                    className="col-md-5"
                                                                 
                                                                />
                                                                    <Field
                                                                    name={`TemporaryVariations[${idx}].key`}
                                                                    type="text"
                                                                    placeholder="Key"
                                                                    onBlur={props.handleBlur}
                                                                    style={{ display: "inline" }}
                                                                    className="col-md-4"
                                                               
                                                                    id={keysId}
                                                                />
                                                                <Field
                                                                    name={`TemporaryVariations[${idx}].description`}
                                                                    type="text"
                                                                    style={{ display: "inline" }}
                                                                    className="col-md-3"
                                                                    id={descriptionsId}
                                                                    placeholder="Enter ... "
                                                                />
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
                                                <Button onClick={() => this.addVariation(props.values.TemporaryVariations)}>
                                                    +Add Variation
                                                </Button>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" type="submit">
                                                    SUBMIT </Button>
                                                
                                            </ModalFooter>
                                            </Form>
                                        </Modal>
                                    
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


function mapStateToProps(state) {
   
    //Object of state that shall now return as props to whole component
    return {
        featureFlag: state.featureFlag
    };
}

//export default
//    MyForm;



    //UpdateInputState is the action which calls reducer called InputBoxesUpdater
function matchDispatchToProps(dispatch) {
    return {
        SubmitFeatureFlagToRedux: (prevFeatureFlag, featureKey, maxIDreached, featureName, featureDesc, temp_bool_on_true, TemporaryVariations) => {
            dispatch(
                featureFlagSubmitState(prevFeatureFlag, featureKey, maxIDreached, featureName, featureDesc, temp_bool_on_true, TemporaryVariations)
            );
        }
    };
}

export default connect(
    mapStateToProps,
    matchDispatchToProps
)(MyForm);
