
const containerWrapper = document.getElementById("posts-container");

let articles = document.getElementsByTagName("article");
var posts = [];
var postByTags = [];
for (let a = 0; a < articles.length; a++) {
  posts.push(articles[a].outerHTML);
  let postTagWrappers = articles[a].getElementsByClassName("tag");
  let postTags = [];
  for (let ptw = 0; ptw < postTagWrappers.length; ptw++) {
    postTags.push(postTagWrappers[ptw].innerHTML);
  }

  postByTags.push(postTags);
}

var tagWrappers = [];
var tagFilter = [];

function tagEventListener(func) {
  tagWrappers = document.getElementsByClassName("tag");
  for (let i = 0; i < tagWrappers.length; i++) {
    tagWrappers[i].addEventListener("click", func);
  }
}
  
function tagClick() {
  let tagName = this.innerHTML;
  let tagIdx = tagFilter.indexOf(tagName);
  if (tagIdx == -1) {
    tagFilter.push(tagName);
  }
  else {
    let tagIdx = tagFilter.indexOf(tagName);
    tagFilter.splice(tagIdx, 1);
  }

  filterPostByTag();
  switchTagsCSS();
}

function switchTagsCSS() {
  for (let i = 0; i < tagWrappers.length; i++) {
    if (tagFilter.includes(tagWrappers[i].innerHTML)) {
      tagWrappers[i].classList.add("tag-switched");
    }
    else {
      tagWrappers[i].classList.remove("tag-switched");
    }
  }
}

function filterPostByTag() {
  let html = "";
  for (let p = 0; p < posts.length; p++) {
    let includeTag = true;
    if (tagFilter.length) {
      for (let tf = 0; tf < tagFilter.length; tf++) {
        includeTag &&= postByTags[p].includes(tagFilter[tf]);
      }
    }   

    if (includeTag) {
      html += posts[p];
    }
  }

  containerWrapper.innerHTML = html;
  tagEventListener(tagClick);
} 
  

const url = window.location.href.split("?");
if (url[1] != undefined) {
  const serachParams = new URLSearchParams(url[1]);
  let paramTags = serachParams.get("tags").split(",");
  tagFilter = tagFilter.concat(paramTags);
}

filterPostByTag();
switchTagsCSS();