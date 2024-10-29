"use strict";

// save to local storaage
function saveToStorage(key, value) {
  localStorage.setItem(key, value);
}

// read from local storage
function getFromStorage(key) {
  return localStorage.getItem(key);
}

// remove value
function removeFromStorage(key) {
  return localStorage.removeItem(key);
}
