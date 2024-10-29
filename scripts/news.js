"use strict";
//div rendering news
const divNewsContainer = document.getElementById("news-container");
//ul Paginator
const ulPaginator = document.querySelector(".pagination");

//check login to continue
let currentUser = User.checkAndGetLoginUser();
if (null !== currentUser) {
  getNewsAtPage(1);
  // back to page home if do not have acccount
} else {
  redirectToHome();
}

// clear div new
function doClearNews() {
  divNewsContainer.innerHTML = "";
}

// get and render news at a page with iPage from fecth
async function getNewsAtPage(iPage) {
  let currentUser = User.checkAndGetLoginUser();
  if (currentUser !== null) {
    try {
      doClearNews();
      let news_ret = await currentUser.fetchNews(iPage);
      if (news_ret.status === "ok") {
        let articles = news_ret.articles;
        articles.forEach(function (item, idx) {
          let sNewsItem = User.genHtmlNewsItem(item);
          divNewsContainer.insertAdjacentHTML("beforeend", sNewsItem);
        });
      }
      // console.log(news_ret);
      regenPaginator(news_ret, iPage, currentUser.getPageSize());
      return news_ret;
    } catch (e) {
      divNewsContainer.innerHTML = e;
      console.error(e);
      return false;
    }
  }
  return false;
}

// generator paginator after fetching
const regenPaginator = function (news_ret, iPage, iPageSize) {
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
      if (iPage - 1 > 0) getNewsAtPage(iPage - 1);
    });
    if (iPage == 1) liPage_Prev.classList += " hid";

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
      if (iPage + 1 <= iPageCount) getNewsAtPage(iPage + 1);
    });
    if (iPage == iPageCount) liPage_Next.classList += " hid";
  }
};
