'use strict';
import Spinner from 'spin';
import { processRoot } from './result.js';
import { makeQueryUrl } from './url.js';

function processQuery(input) {
  document.getElementById('search-input').value = input;
  sendXMLHttpRequest(input);
}

function sendXMLHttpRequest(input) {
  const xhr = new XMLHttpRequest();
  const url = makeQueryUrl(input);

  const target = document.getElementById('spinner')
  const spinner = new Spinner().spin(target);

  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          const doc = xhr.response;
          processRoot(doc);
          spinner.stop();
      }
  }
  xhr.open('GET', url, true);
  xhr.responseType = "document";
  xhr.send(null);
}

chrome.tabs.executeScript( {
      code: "window.getSelection().toString();"
}, function(selection) {
      if (selection) {
        processQuery(selection[0]);
      }
});

const submitForm = document.querySelector('form');
submitForm.addEventListener('submit',
  event => {
    event.preventDefault();
    processQuery(document.getElementById('search-input').value);
  }
);

