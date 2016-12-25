'use strict';
import isAbsoluteUrl from 'is-absolute-url'
import URL from 'url-parse'
import Spinner from 'spin'

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

function removeNodes(targetDOM,selector) {

  const unecessary = targetDOM.querySelectorAll(selector);
  for (let elem of unecessary) {
    elem.remove();
  }
}

function removeAllChildren(elm) {
  while (elm.hasChildNodes())
      elm.removeChild(elm.lastChild);
}

function processQuery(input) {
  document.getElementById('search-input').value = input;
  sendXMLHttpRequest(input);
}

function sendXMLHttpRequest(input) {
  var xhttp = new XMLHttpRequest();
  var xhr = new XMLHttpRequest();
  const url = makeUrl(input);

  var target = document.getElementById('spinner')
  var spinner = new Spinner().spin(target);

  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          const semanticDiv = document.getElementById('semantic-scholar');
          const resultsDiv = document.getElementById('results');
          const symbolsDiv = document.getElementById('symbols');
          removeAllChildren(resultsDiv);
          removeAllChildren(symbolsDiv);

          const doc = xhr.response;
					const style = doc.querySelector('link[rel="stylesheet"]');
          resultsDiv.appendChild(style);

					const symbolDOMs = doc.querySelectorAll('symbol');
          for (let symbolDOM of symbolDOMs) {
            symbolsDiv.appendChild(symbolDOM);
          }

          for (let resDOM of getResults(doc)) {
            removeNodes(resDOM,'.search-result__stats , .featured-mention , .search-result-badges , .more , .paper-actions-toggle');
            removeAttributes(resDOM,['data-reactid','target']);
            resultsDiv.appendChild(resDOM);
            console.log(resDOM);
          }
          addLinkListener();
          spinner.stop();
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
      processQuery(selection[0]);
});

const submitForm = document.querySelector('form');
submitForm.addEventListener('submit',
  event => {
    event.preventDefault();
    processQuery(document.getElementById('search-input').value);
  }
);

