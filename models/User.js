"use strict";

//Require: storage.js, common.js

//Constants
//api url to fetch news
const api_url_get = "https://newsapi.org/v2/top-headlines";

//api url to search news for keyword
const api_url_search = "https://newsapi.org/v2/everything";

//api key
const api_key = "7fc53420cdbb42e79406895474fd6eca";

class User {
  //constructor for a new user
  constructor(firstName, lastName, userName, passWord, pageSize, category) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.passWord = passWord;
    this.pageSize = pageSize;
    this.category = category;
  }

  //static array contains all users of the program
  static userArr;
  //static configuration parameter: number of news record for each news fetch request
  static pageSize;
  static category;

  //initialization of static members
  static {
    this.userArr = JSON.parse(getFromStorage(KEY_USER_ARRAY)) || [];
    this.pageSize = 5;
    this.category = "general";
    this.country = "us";
  }

  // return a User object ( change Class Instance userData to user)
  static parseUser(userData) {
    const user = new User(
      userData.firstname,
      userData.lastname,
      userData.username,
      userData.password,
      userData.pagesize,
      userData.category
    );

    return user;
  }

  // convert this user instance into json object (for storing)  // return a json object of a user
  convertToJSONObj() {
    return {
      firstname: this.firstName,
      lastname: this.lastName,
      username: this.userName,
      password: this.passWord,
      pagesize: this.pageSize,
      category: this.category,
    };
  }

  //  a user object in local storage if searching ok, null if not
  static findUser_ByUsername(username) {
    let username1 = username.trim().toLowerCase();
    for (let i = 0; i < this.userArr.length; i++) {
      if (this.userArr[i].username.trim().toLowerCase() === username1)
        return User.parseUser(this.userArr[i]);
    }
    return null;
  }

  // append and save to storage a new user by json object
  static addUser(jsonObj) {
    let ret = false;
    if (jsonObj === undefined || jsonObj.username === undefined) return ret;
    jsonObj.username = jsonObj.username.trim().toLowerCase();
    let checkExist = this.findUser_ByUsername(jsonObj.username);
    if (checkExist === null) {
      let newUser = this.parseUser(jsonObj);
      this.userArr.push(newUser.convertToJSONObj());
      saveToStorage(KEY_USER_ARRAY, JSON.stringify(this.userArr));
      ret = true;
    }

    return ret;
  }

  // save to storage a user by json object
  static saveUser(jsonObj) {
    let ret = false;
    if (jsonObj === undefined || jsonObj.username === undefined) return ret;

    let username = jsonObj.username.trim().toLowerCase();
    for (let i = 0; i < this.userArr.length; i++) {
      if (this.userArr[i].username.trim().toLowerCase() === username) {
        this.userArr[i] = jsonObj;
        saveToStorage(KEY_USER_ARRAY, JSON.stringify(this.userArr));
        ret = true;
        break;
      }
    }
    return ret;
  }

  // check username exists
  static existUser_ByUsername(username) {
    let user = this.findUser_ByUsername(username);
    return user !== null;
  }

  // check logged in or not
  static checkAndGetLoginUser() {
    let username = getFromStorage(KEY_CURRENT_USER);
    let ret = null;
    if (username !== null) {
      let currentUser = User.findUser_ByUsername(username);
      if (null !== currentUser) {
        ret = currentUser;
      }
    }
    return ret;
  }

  // check confirm Pass
  static checkMatchUserPassword(username, password) {
    let ret = false;
    let user_searching = this.findUser_ByUsername(username);
    if (null !== user_searching) {
      if (password !== "" && password === user_searching.passWord) ret = true;
    }
    return ret;
  }

  // clear current, back page home
  static logOut() {
    removeFromStorage(KEY_CURRENT_USER);
    redirectToHome();
  }

  // fetch result in json object
  async fetchNews(page, category, pageSize) {
    if (pageSize == undefined) pageSize = this.pageSize || User.pageSize;
    if (category == undefined) category = this.category || User.category;

    let api_fetch_url = `${api_url_get}?country=${User.country}&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${api_key}`;

    const retNews = await fetch(api_fetch_url);
    if (!retNews.ok) {
      if (retNews.status == 429) {
        throw new Error("Out of quota!");
      }
      throw new Error("Error in fetching");
    }
    return await retNews.json();
  }

  // search news with customize options of a user as default
  async searchNews(keyword, page, pageSize) {
    if (pageSize == undefined) pageSize = this.pageSize || User.pageSize;
    let api_search_url = `${api_url_search}?q=${keyword}&pageSize=${pageSize}&page=${page}&apiKey=${api_key}`;

    const retNews = await fetch(api_search_url);
    if (!retNews.ok) {
      if (retNews.status == 429) {
        throw new Error("Out of quota!");
      }
      throw new Error("Error in fetching");
    }
    return await retNews.json();
  }

  // generate a html string of news from
  static genHtmlNewsItem(news_record) {
    //console.log(news_record);
    let urlimg =
      news_record.urlToImage ||
      "data:image/jpeg;base64,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";
    let content = news_record.content || "No content";
    return `
  <div class="card flex-row flex-wrap">
            <div class="card mb-3" style="">
              <div class="row no-gutters">
                <div class="col-md-4">
                  <img
                    src="${urlimg}"
                    class="card-img"
                    alt="${news_record.title}"
                  />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">
                      ${news_record.title}
                    </h5>
                    <p class="card-text">
                      ${content}
                    </p>
                    <a
                      href="${news_record.url}"
                      class="btn btn-primary"
                      >View</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          `;
  }

  // get page size option of a user
  getPageSize() {
    if (this.pageSize !== undefined) return this.pageSize;
    return User.pageSize;
  }

  // save a user down to storage
  saveMe() {
    let jsonObjMe = this.convertToJSONObj();
    return User.saveUser(jsonObjMe);
  }

  //  save settings
  saveSettings(settings) {
    let iPageSize = User.validatePageSize("" + settings.pageSize);
    if (iPageSize !== false) this.pageSize = iPageSize;
    else {
      this.pageSize = undefined;
    }
    this.category = settings.category;
    return this.saveMe();
  }

  // validate setting page size
  static validatePageSize(pageSize) {
    let ret = false;
    if (pageSize.trim() !== "") {
      let iPageSize = Number.parseInt(pageSize.trim());
      if (!isNaN(iPageSize) && iPageSize > 0) {
        ret = iPageSize;
      }
    }
    return ret;
  }
}
