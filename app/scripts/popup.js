'use strict';
import isAbsoluteUrl from 'is-absolute-url';
import URL from 'url-parse';
import Spinner from 'spin';
import { processRoot } from './result.js';

function makeUrl(input) {
  const url = `https://www.semanticscholar.org/search?&q=${input}`;
  return url;
}

function processQuery(input) {
  document.getElementById('search-input').value = input;
  sendXMLHttpRequest(input);
}

function sendXMLHttpRequest(input) {
  var xhttp = new XMLHttpRequest();
  var xhr = new XMLHttpRequest();
  const url = makeUrl(input);

  const target = document.getElementById('spinner')
  const spinner = new Spinner().spin(target);

  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          const doc = xhr.response;
          processRoot(doc);
          addLinkListener();
          spinner.stop();
      }
  }
  xhr.open('GET', url, true);
  xhr.responseType = "document";
  xhr.send(null);
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

