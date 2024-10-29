"use strict";
//GLOBAL VARIABLES
const frmSearch = document.querySelector("#frmSearch");
//div Status: show validation errors...
const divStatus = document.getElementById("divStatus");
//button Search
const btnSearch = frmSearch.querySelector("#btn-submit");
//news container
const divNewsContainer = document.getElementById("news-container");
//ul Paginator
const ulPaginator = document.querySelector(".pagination");

//check login to continue
let user_logged_in = User.checkAndGetLoginUser();
if (user_logged_in !== null) {
  doInitPage();
} else {
  redirectToHome();
}

// Click btn
function doInitPage() {
  btnSearch.addEventListener("click", doSearchEventHandler);
}

// func click btn
function doSearchEventHandler() {
  //reset status
  statusClear(divStatus);

  //collect data
  let record = collectInputs(frmSearch);

  //validate search input
  let validate_result = doValidateInputs_SearchInput(record);

  if (!validate_result.kq) {
    //In case of invalid data
    //show invalidated errors
    statusError(validate_result, divStatus);
  } else {
    //In case of valid data
    //send search request at first page
    let keyword = validate_result.validated_record.query;
    // console.log(keyword);
    searchNewsAtPage(keyword, 1);
  }
}

// clear news
function doClearNews() {
  divNewsContainer.innerHTML = "";
}

// search and render news at page I
async function searchNewsAtPage(keyword, iPage) {
  let currentUser = User.checkAndGetLoginUser();
  if (currentUser !== null) {
    try {
      doClearNews();
      let news_ret = await currentUser.searchNews(keyword, iPage);
      if (news_ret.status === "ok") {
        let articles = news_ret.articles;
        articles.forEach(function (item, idx) {
          let sNewsItem = User.genHtmlNewsItem(item);
          divNewsContainer.insertAdjacentHTML("beforeend", sNewsItem);
        });
      }
      // console.log(news_ret);
      regenPaginator(news_ret, keyword, iPage, currentUser.getPageSize());
      return news_ret;
    } catch (e) {
      divNewsContainer.innerHTML = e;
      console.error(e);
      return false;
    }
  }
  return false;
}

// validate search
function doValidateInputs_SearchInput(record) {
  let arrErrors = {};
  let keys = Object.keys(record);
  //   console.log(keys);

  //check required inputs
  for (let i = 0; i < keys.length; i++) {
    if (record[keys[i]] === undefined || record[keys[i]] === "") {
      arrErrors["requires_" + i] = inputNames[keys[i]] + " is required";
    }
  }
  return {
    kq: Object.keys(arrErrors).length == 0 ? true : false, //if there is any error => invalidated
    errors: arrErrors,
    validated_record: record,
  };
}

// generator paginator after fetching
function regenPaginator(news_ret, keyword, iPage, iPageSize) {
  if (iPageSize == 0) return;
  let iNewsCount = news_ret.totalResults;
  if (iNewsCount !== undefined && iNewsCount > 0 && iPageSize > 0) {
    let iPageCount = Math.ceil(iNewsCount / iPageSize);
    //reset ulPaginator
    let liPages = ulPaginator.querySelectorAll("li");

    liPages.forEach((li) => li.remove());

    //Prev button
    let liPage_Prev = document.createElement("li");
    liPage_Prev.classList += "page-item";
    liPage_Prev.innerHTML = `<button class="page-link" href="#" id="btn-prev">Previous</button>`;
    ulPaginator.append(liPage_Prev);
    liPage_Prev.addEventListener("click", function () {
      if (iPage - 1 > 0) searchNewsAtPage(keyword, iPage - 1);
    });
    if (iPage == 1) liPage_Prev.classList += " hid";

    //Current page button
    let newLiPage = document.createElement("li");
    newLiPage.classList += "page-item active";
    newLiPage.innerHTML = `<a class="page-link" id="page-num">${iPage}</a>`;
    ulPaginator.append(newLiPage);

    //Next button
    let liPage_Next = document.createElement("li");
    liPage_Next.classList += "page-item";
    liPage_Next.innerHTML = `<button class="page-link" id="btn-next">Next</button>`;
    ulPaginator.append(liPage_Next);
    liPage_Next.addEventListener("click", function () {
      if (iPage + 1 <= iPageCount) searchNewsAtPage(keyword, iPage + 1);
    });
    if (iPage == iPageCount) liPage_Next.classList += " hid";
    //}
  }
}
