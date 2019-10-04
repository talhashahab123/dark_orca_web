export const featureFlagSubmitState = (
  prevState,
  featureKey,
  maxIDreached,
  featureName,
  featureDesc,
  temp_bool_on_true,
  TemporaryVariations
) => {
  var FeatureFlagUpdated = {
    featureFlag: [
      ...prevState.featureFlag,
      {
        key: "Key - " + featureKey,
        name: "Feature " + (maxIDreached + 1) + " - " + featureName,
        description: "Description - " + featureDesc,
        switchOn: temp_bool_on_true,
        Variation: TemporaryVariations
      }
    ]
  };
  return dispatch => {
    dispatch({ type: "NEW_FEATURE_FLAG_STATE", payload: FeatureFlagUpdated });
  };
};

