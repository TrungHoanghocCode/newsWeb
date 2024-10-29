"use strict";
//GLOBAL VARIABLES
//form Register
const frmRegister = document.querySelector("#frmRegister");
//div Status: show validation errors...
const divStatus = document.getElementById("divStatus");
//button Register
const btnRegist = frmRegister.querySelector("#btn-submit");

// Click btn
btnRegist.addEventListener("click", doRegisterHandler);

// func when click btn
function doRegisterHandler() {
  //reset status
  statusClear(divStatus);
  //collect new user information (1 Object)
  let record = collectInputs(frmRegister);
  //validate new user
  let validate_result = doValidateInputs_NewUser(record);
  console.log(!validate_result.kq);
  if (validate_result.kq) {
    //In case of valid data
    //append to end of user array
    let ret_add = User.addUser(validate_result.validated_record);
    clearForm(frmRegister);
    //notify success
    ret_add
      ? statusMessage("Regist successful!", divStatus)
      : statusError("Error in add user", divStatus);
  } else {
    //In case of invalid data
    //show invalidated errors
    statusError(validate_result, divStatus);
  }
}

// func validate , return 1 Obj has 3 prop: kq, er , vali
const doValidateInputs_NewUser = function (record) {
  let arrErrors = {};
  // get property in Obj record
  let keys = Object.keys(record);

  //check required inputs
  for (let i = 0; i < keys.length; i++) {
    if (record[keys[i]] === undefined || record[keys[i]] === "") {
      arrErrors["requires_" + i] = inputNames[keys[i]] + " is required";
    }
  }

  //
  if (!checkUniqueUsername(record.username)) {
    arrErrors["username_not_unique"] = `Username "${record.username}" is used`;
  }

  //check repeat password
  if (!checkMatchPasswordConfirm(record.password, record["password-confirm"])) {
    arrErrors["password_confirm_not_match"] = "Confirm Password is not match";
  }

  //check min length of password
  if (record.password.length < 8) {
    arrErrors["password_min_length"] =
      "Minimum password length is 8 characters";
  }

  //remove unneccessary property
  delete record["password-confirm"];

  return {
    kq: Object.keys(arrErrors).length == 0 ? true : false, //if there is any error => invalidated
    errors: arrErrors,
    validated_record: record,
  };
};

// func check uniqueUser
const checkUniqueUsername = function (username) {
  return !User.existUser_ByUsername(username);
};

// func check confirmPass
const checkMatchPasswordConfirm = function (password, password_confirm) {
  if (password !== undefined && password === password_confirm) return true;
  return false;
};
