"use strict";
//button Add
const btnAdd = document.getElementById("btn-add");
//input task content
const inputTask = document.getElementById("input-task");
//ul Task list
const ulTodoList = document.getElementById("todo-list");

//check login to continue

let user_logged_in = User.checkAndGetLoginUser();
if (user_logged_in !== null) {
  let arrOwnTasks = Task.getOwnerTask(user_logged_in.userName);
  reRenderTasks(arrOwnTasks);
} else {
  redirectToHome();
}

//attach event handler to ul Task list
ulTodoList.addEventListener("click", function (e) {
  // console.log(e.target);
  // console.log(this);
  let target = e.target;
  if (target.classList.contains("close")) {
    //click on Delete button
    //delete task
    let unique_key = target.parentElement.getAttribute("unique_key");
    // console.log("delete " + unique_key);
    if (confirm("Are you sure?")) {
      let count = Task.deleteByUniqueKey(unique_key);
      if (count > 0) {
        reRenderOwnTasks();
      }
      //Task.deleteByUniqueKey(unique_key) && reRenderOwnTasks();
    }
  } else if (target.tagName.toLowerCase() === "li") {
    //click on task
    //check done status
    let unique_key = target.getAttribute("unique_key");
    Task.toggleTaskStatusByUniqueKey(unique_key) && reRenderOwnTasks();
    // console.log("check status " + unique_key);
  }
});

//attach event handler to add a new list
btnAdd.addEventListener("click", function () {
  //add a task

  let currentUser = User.checkAndGetLoginUser();
  if (currentUser) {
    let txtTaskContent = inputTask.value.trim();
    if (txtTaskContent.length > 0) {
      let new_task = new Task(txtTaskContent, currentUser.userName, makeid(10));
      //   console.log(new_task);
      new_task.save();
      reRenderOwnTasks();
    }
    inputTask.value = "";
    inputTask.focus();
  }
});

// render tasks on page
function reRenderTasks(arrTasks) {
  //   console.log(arrOwnTasks);
  reRenderTasks_clear();
  for (let i = 0; i < arrTasks.length; i++) {
    let task = arrTasks[i];
    let new_li = document.createElement("li");
    if (task.isDone) {
      new_li.classList += " checked";
    }
    new_li.innerHTML = `${task.task}
    <span class="close">×</span>`;
    new_li.setAttribute("unique_key", task.unique_key);
    ulTodoList.append(new_li);
  }
}

//  render tasks of current user
function reRenderOwnTasks() {
  let user_logged_in = User.checkAndGetLoginUser();
  if (user_logged_in !== null) {
    let arrOwnTasks = Task.getOwnerTask(user_logged_in.userName);
    reRenderTasks(arrOwnTasks);
  } else {
  }
}

// func render task
function reRenderTasks_clear() {
  let collectionLi = ulTodoList.getElementsByTagName("li");
  while (collectionLi.length > 0) {
    collectionLi[0].remove();
  }
}
