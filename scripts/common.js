"use strict";
//local storage key for saving array of users
const KEY_USER_ARRAY = "USER_ARRAY";

//local storage key for saving current user
const KEY_CURRENT_USER = "CURRENT_USER";

//local storate key for saving array of tasks
const KEY_TASK_ARRAY = "KEY_TASK_ARRAY";

// function to back homepage
function redirectToHome() {
  window.location.href = "../index.html";
}

// func clear div
function statusClear(divStatus) {
  divStatus.innerHTML = "";
}

// func render when error
function statusError(validate_result, divStatus) {
  if (typeof validate_result === "string") {
    divStatus.innerHTML =
      "<div class='alert-danger'>" + validate_result + "</div>";
    return;
  }

  let sError = "";
  let keys = Object.keys(validate_result.errors);
  //   console.log(keys);
  //check required input
  for (let i = 0; i < keys.length; i++) {
    let error_i = validate_result.errors[keys[i]];
    sError += "<li>" + error_i + "</li>";
  }
  divStatus.innerHTML =
    "<div class='alert-danger'>Errors:<ol>" + sError + "</ol></div>";
}

// func render when succes
function statusMessage(msg, divStatus) {
  divStatus.innerHTML = msg;
}

// func clear form input
const clearForm = function (eleForm) {
  let arrInput = eleForm.querySelectorAll("input");
  let arrSelects = eleForm.querySelectorAll("select");
  for (let i = 0; i < arrInput.length; i++) {
    let input = arrInput[i];
    if (input.type == "checkbox") {
      input.checked = false;
    } else if (input.type == "text") {
      input.value = "";
    } else if (input.type == "number") {
      input.value = 0;
    }
  }

  for (let i = 0; i < arrSelects.length; i++) {
    let select = arrSelects[i];
    let valFirst = select.getElementsByTagName("option")[0];
    // console.log(valFirst);
    select.value = valFirst.innerHTML;
  }
};

// func collect DOM value input form
const collectInputs = function (eleForm) {
  let arrInput = eleForm.querySelectorAll("input");
  let arrSelects = eleForm.querySelectorAll("select");
  //   console.log(arrSelects);
  let result = {};
  //   console.log(arrInput);
  for (let i = 0; i < arrSelects.length; i++) {
    let select = arrSelects[i];
    let name = select.id;
    if (name !== undefined) {
      name = name.replace("input-", "");
      result[name] = select.value;
    }
  }

  for (let i = 0; i < arrInput.length; i++) {
    let input = arrInput[i];
    let name = input.id;
    if (name !== undefined) {
      name = name.replace("input-", "");
      if (input.type == "checkbox") {
        result[name] = input.checked;
      } else {
        result[name] = input.value;
      }
    }
  }
  //result.date = new Date();
  return result;
};

// func makeid for todo list, return 1 str
function makeid(length = 6) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// list property for str note
const inputNames = {
  firstname: "First Name",
  lastname: "Last Name",
  username: "Username",
  password: "Password",
  "password-confirm": "Password Confirm",
  category: "Category",
  "page-size": "News per page",
  query: "Keyword",
};
