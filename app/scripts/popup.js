'use strict';
import isAbsoluteUrl from 'is-absolute-url'
import URL from 'url-parse'
import {Result} from './result.js'
// import { Test } from './test.js';
// new Test('Babel');
function makeUrl(input) {
  const url = `https://www.semanticscholar.org/search?&q=${input}`;
  return url;
}

function sendXMLHttpRequest(input) {
  var xhttp = new XMLHttpRequest();
  var xhr = new XMLHttpRequest();
  const url = makeUrl(input);

  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          const htmlString = xhr.responseText;
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlString, 'text/html');
          console.log(Result);
          for (let res of getResults(doc))
            console.log(Result.fromDOM(res));
//           document.getElementById('demo').innerHTML = res.innerHTML;
//           addLinkListener();
      }
  }
  xhr.open('GET', url, true);
  xhr.send(null);
}

function getResults(doc){
  const arr = [];
  const results = doc.getElementsByClassName('search-result');
  for (let res of results)
    arr.push(res);
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
            console.log(location);
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
