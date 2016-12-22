'use strict';
// import $ from 'jquery'
import isAbsoluteUrl from 'is-absolute-url'
import URL from 'url-parse'
import {Result} from './result.js'
// import { Test } from './test.js';
// new Test('Babel');
function makeUrl(input) {
  const url = `https://www.semanticscholar.org/search?&q=${input}`;
  return url;
}

function removeAttributes(targetDOM,attribues) {

	const tw = document.createTreeWalker(targetDOM,
	NodeFilter.SHOW_ELEMENT,
	(node) => {
    return NodeFilter.FILTER_ACCEPT;
	},
	false);

	let node = tw.currentNode;
  do{
    for (let attr of attribues) {
      node.removeAttribute(attr);
    }
  } while(node = tw.nextNode());
}

// function removeNodes(targetDOM,funcs) {
//
// 	const tw = document.createTreeWalker(targetDOM,
// 	NodeFilter.SHOW_ELEMENT,
// 	(node) => {
//     for (let func of funcs) {
//       if (func(node)) {
//         console.log('remove');
//         return NodeFilter.FILTER_ACCEPT;
//       }
//       return NodeFilter.FILTER_SKIP;
//     }
// 	},
// 	false);
//
// 	let node = tw.currentNode;
//   do{
//     console.log(node);
//     node.remove();
//   } while(node = tw.nextNode());
// }

function removeNodes(targetDOM,selector) {

  const unecessary = targetDOM.querySelectorAll(selector);
  for (let elem of unecessary) {
    elem.remove();
  }
}

function sendXMLHttpRequest(input) {
  var xhttp = new XMLHttpRequest();
  var xhr = new XMLHttpRequest();
  const url = makeUrl(input);

  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          const doc = xhr.response;
          const demo = document.getElementById('demo');
          for (let resDOM of getResults(doc)) {
            removeNodes(resDOM,'.search-result__stats , .featured-mention');
            removeAttributes(resDOM,['data-reactid']);
            demo.appendChild(resDOM);
            console.log(resDOM);
          }
          addLinkListener();
      }
  }
  xhr.open('GET', url, true);
  xhr.responseType = "document";
  xhr.send(null);
}

function getResults(doc){
  const arr = [];
  const results = doc.getElementsByClassName('search-result');
  for (let res of results){
    arr.push(res);
  }
  return arr;
}

function addLinkListener(){
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        (function () {
            const ln = links[i];
            const url = new URL(ln.href);
            if (url.protocol == 'chrome-extension:'){
              var location = 'https://www.semanticscholar.org' + url.pathname;
            }else{
              var location = url.protocol + url.hostname + url.pathname;
            }
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
}

chrome.tabs.executeScript( {
      code: "window.getSelection().toString();"
}, function(selection) {
      sendXMLHttpRequest(selection[0]);
});
