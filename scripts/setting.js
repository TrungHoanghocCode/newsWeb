"use strict";
//check login to continue
let user_logged_in = User.checkAndGetLoginUser();
if (user_logged_in !== null) {
  doInitPage();
} else {
  redirectToHome();
}

// do initiating tasks of page
function doInitPage() {
  //button Save
  const btnSave = document.getElementById("btn-submit");
  //form Settings
  const frmSettings = document.getElementById("frmSettings");

  //load values into form inputs
  doFormLoad(frmSettings);

  //attach event handler to button btnSave
  btnSave.addEventListener("click", function () {
    //collect setting information
    let record = collectInputs(frmSettings);

    //validate user setting
    let validate_result = doValidateInputs_Setting(record);
    if (!validate_result.kq) {
      //In case of invalid data
      //show invalidated errors
      statusError(validate_result, divStatus);
    } else {
      //In case of valid data, save
      let save_ret = saveSettings(validate_result.validated_record);
      //notify result of saving user settings
      save_ret
        ? statusMessage("Saved successful!", divStatus)
        : statusError("Error in saving settings", divStatus);
    }
  });
}

// save user settings to local storage
function saveSettings(settings) {
  let ret_save = false;
  let user_logged_in = User.checkAndGetLoginUser();
  if (user_logged_in !== null) {
    ret_save = user_logged_in.saveSettings(settings);
  }
  return ret_save;
}

// validate settings information
function doValidateInputs_Setting(record) {
  let arrErrors = {};
  let keys = Object.keys(record);
  //   console.log(keys);

  //check required inputs
  if (record.category === undefined || record.category === "") {
    arrErrors["requires_category"] = "Category is required";
  }

  let pageSize = User.validatePageSize(record["page-size"]);
  if (pageSize == false) {
    arrErrors["page_size_invalid"] = "News per page is not valid";
  } else {
    record.pageSize = pageSize;
    delete record["page-size"];
  }

  delete record["date"];

  return {
    kq: Object.keys(arrErrors).length == 0 ? true : false, //if there is any error => invalidated
    errors: arrErrors,
    validated_record: record,
  };
}

// load settings values to form inputs
function doFormLoad(frmSettings) {
  let user_logged_in = User.checkAndGetLoginUser();
  if (user_logged_in !== null) {
    let inputPageSize = frmSettings.querySelector("#input-page-size");
    let selectCategory = frmSettings.querySelector("#input-category");
    if (inputPageSize !== null && user_logged_in.pageSize !== undefined)
      inputPageSize.value = user_logged_in.pageSize;
    if (selectCategory !== null && user_logged_in.category !== undefined)
      selectCategory.value = user_logged_in.category;
  }
}
