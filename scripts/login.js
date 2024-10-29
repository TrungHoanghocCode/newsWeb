"use strict";
//form Login
const frmLogin = document.querySelector("#frmLogin");
//div Status: show validation errors...
const divStatus = document.getElementById("divStatus");
//button Login
const btnLogin = frmLogin.querySelector("#btn-submit");

// Click btn
btnLogin.addEventListener("click", doLoginHandler);

// func when click btn
function doLoginHandler() {
  //reset status
  statusClear(divStatus);
  //collect login data
  let record = collectInputs(frmLogin);
  //validate login data
  let validate_result = doValidateInputs_Login(record);
  if (!validate_result.kq) {
    //In case of invalid data
    //show invalidated errors
    statusError(validate_result, divStatus);
  } else {
    //In case of valid data
    //notify successful login
    statusMessage("Login successful, please wait..", divStatus);
    //hide form to prohibit more unexpected  actions from user
    frmLogin.style.display = "none";
    //keep current user
    saveToStorage(KEY_CURRENT_USER, validate_result.validated_record.username);
    // back to home page
    redirectToHome();
  }
}

// func validate login ~~ validate reg
const doValidateInputs_Login = function (record) {
  let arrErrors = {};
  // get property in obj record
  let keys = Object.keys(record);

  //check required inputs
  for (let i = 0; i < keys.length; i++) {
    if (record[keys[i]] === undefined || record[keys[i]] === "") {
      arrErrors["requires_" + i] = inputNames[keys[i]] + " is required";
    }
  }

  //check exist user with right password
  if (!User.checkMatchUserPassword(record.username, record.password)) {
    arrErrors["login_failed"] = "Login failed";
  } else {
    record.username = record.username.trim().toLowerCase();
  }

  return {
    kq: Object.keys(arrErrors).length == 0 ? true : false, //if there is any error => invalidated
    errors: arrErrors,
    validated_record: record,
  };
};
