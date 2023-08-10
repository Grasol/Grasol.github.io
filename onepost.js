
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

function tagEventListener(func) {
  tagWrappers = document.getElementsByClassName("tag");
  for (let i = 0; i < tagWrappers.length; i++) {
    tagWrappers[i].addEventListener("click", func);
  }
}
  
function tagClick() {
  let tagName = this.innerHTML;
  window.location.href = `https://grasol.github.io?tags=${tagName}`;
}


//const url = window.location.href.split("?");
//if (url[1] != undefined) {
//  const serachParams = new URLSearchParams(url[1]);
//  let paramTags = serachParams.get("tags").split(",");
//}

tagEventListener(tagClick);