
const containerWrapper = document.getElementById("post-container");

let articles = document.getElementsByTagName("article");
var posts = [];
var postByTags = [];
for (let a = 0; a < articles.length; a++) {
  posts.push(articles[a].outerHTML);
  let postTagsWrapper = articles[a].getElementsByClassName("tag");
  let postTags = [];
  for (let ptw = 0; ptw < postTagsWrapper.length; ptw++) {
    postTags.push(postTagsWrapper[ptw].innerHTML);
  }

  postByTags.push(postTags);
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

  for (let i = 0; i < tags.length; i++) {
    if (tagFilter.includes(tags[i].innerHTML)) {
      tags[i].classList.add("tag-switched");
    }
    else {
      tags[i].classList.remove("tag-switched");
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
  tagEventListener();
} 

var tags = []
var tagFilter = [];
function tagEventListener() {
  tags = document.getElementsByClassName("tag");
  for (let i = 0; i < tags.length; i++) {
    tags[i].addEventListener("click", tagClick);
  }
}

tagEventListener();
