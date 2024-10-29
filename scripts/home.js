"use strict";
//div Login
const divLoginModal = document.getElementById("login-modal");
//div Welcome user
const divMainContent = document.getElementById("main-content");

let currentUser = User.checkAndGetLoginUser();
if (null !== currentUser) {
  //in case of user logged in, remove div login
  divLoginModal.remove();
  //show welcome
  divMainContent.querySelector(
    "#welcome-message"
  ).innerHTML = `Welcome,  ${currentUser.firstName}`;
  //handling for log out button
  const btnLogout = document.getElementById("btn-logout");
  btnLogout.addEventListener("click", User.logOut);
} else {
  //in case of guest (user not logged in yet)
  divMainContent.remove();
}
