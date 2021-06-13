const isEmpty = string => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email.match(regEx)) return true;
  else return false;
};

exports.validateSignupData = data => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address";
  }

  if (isEmpty(data.password)) errors.password = "Must not be empty";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords must match";
  if (isEmpty(data.handle)) errors.handle = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = data => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = "Must not be empty";
  if (isEmpty(data.password)) errors.password = "Must not be empty";
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.reduceUserDetails = data => {
  let userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;
  if (!isEmpty(data.navColor.trim())) userDetails.navColor = data.navColor;

  return userDetails;
};



exports.reduceClientDetails = data => {
  let clientDetails = {};

  clientDetails.admin = data.admin
  clientDetails.macrosClientReady = data.macrosClientReady
  clientDetails.carbCycling = data.carbCycling
  if (!isEmpty(data.activityLevel.trim())) clientDetails.activityLevel = data.activityLevel;
  if (!isEmpty(data.age.trim())) clientDetails.age = data.age;
  if (!isEmpty(data.carbCyclingMacros.highCarbDay.calories.trim())) clientDetails.carbCyclingMacros.highCarbDay.calories = data.carbCyclingMacros.highCarbDay.calories;
  if (!isEmpty(data.carbCyclingMacros.highCarbDay.carbs.trim())) clientDetails.carbCyclingMacros.highCarbDay.carbs = data.carbCyclingMacros.highCarbDay.carbs;
  if (!isEmpty(data.carbCyclingMacros.highCarbDay.protein.trim())) clientDetails.carbCyclingMacros.highCarbDay.protein = data.carbCyclingMacros.highCarbDay.protein;
  if (!isEmpty(data.carbCyclingMacros.highCarbDay.fat.trim())) clientDetails.carbCyclingMacros.highCarbDay.fat = data.carbCyclingMacros.highCarbDay.fat;
  if (!isEmpty(data.carbCyclingMacros.lowCarbDay.calories.trim())) clientDetails.carbCyclingMacros.lowCarbDay.calories = data.carbCyclingMacros.lowCarbDay.calories;
  if (!isEmpty(data.carbCyclingMacros.lowCarbDay.carbs.trim())) clientDetails.carbCyclingMacros.lowCarbDay.carbs = data.carbCyclingMacros.lowCarbDay.carbs;
  if (!isEmpty(data.carbCyclingMacros.lowCarbDay.protein.trim())) clientDetails.carbCyclingMacros.lowCarbDay.protein = data.carbCyclingMacros.lowCarbDay.protein;
  if (!isEmpty(data.carbCyclingMacros.lowCarbDay.fat.trim())) clientDetails.carbCyclingMacros.lowCarbDay.fat = data.carbCyclingMacros.lowCarbDay.fat;
  if (!isEmpty(data.customMacroPlan.calories.trim())) clientDetails.customMacroPlan.calories = data.customMacroPlan.calories;
  if (!isEmpty(data.customMacroPlan.carbs.trim())) clientDetails.customMacroPlan.carbs = data.customMacroPlan.carbs;
  if (!isEmpty(data.customMacroPlan.protein.trim())) clientDetails.customMacroPlan.protein = data.customMacroPlan.protein;
  if (!isEmpty(data.customMacroPlan.fat.trim())) clientDetails.customMacroPlan.fat = data.customMacroPlan.fat;
  if (!isEmpty(data.firstName.trim())) clientDetails.firstName = data.firstName;
  if (!isEmpty(data.lastName.trim())) clientDetails.lastName = data.lastName;
  if (!isEmpty(data.gender.trim())) clientDetails.gender = data.gender;
  if (!isEmpty(data.inches.trim())) clientDetails.inches = data.inches;
  if (!isEmpty(data.feet.trim())) clientDetails.feet = data.feet;
  if (!isEmpty(data.startingWeight.trim())) clientDetails.startingWeight = data.startingWeight;
  if (!isEmpty(data.tdee.trim())) clientDetails.tdee = data.tdee;
  if (!isEmpty(data.weight.trim())) clientDetails.weight = data.weight;

  return clientDetails;
};
