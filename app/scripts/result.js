import { replaceExtensionUrl } from './url.js';

function removeAttributes(targetDOM, attribues) {

	const tw = document.createTreeWalker(targetDOM,
	NodeFilter.SHOW_ELEMENT,
	() => {
    return NodeFilter.FILTER_ACCEPT;
	},
	false);

	let node = tw.currentNode;
  do{
    for (const attr of attribues) {
      node.removeAttribute(attr);
    }
  } while(node = tw.nextNode());
}

function removeNodes(targetDOM, selector) {
  const unecessary = targetDOM.querySelectorAll(selector);
  for (const elem of unecessary) {
    elem.remove();
  }
}

function removeAllChildren(elm) {
  while (elm.hasChildNodes()) {
      elm.removeChild(elm.lastChild);
	}
}

function getResults(rootDOM){
  const arr = [];
  const results = rootDOM.getElementsByClassName('search-result');
  for (const res of results){
    arr.push(res);
  }
  return arr;
}

export function processRoot(rootDOM) {
  const semanticDiv = document.getElementById('semantic-scholar');
  if (!semanticDiv.shadowRoot) {
    semanticDiv.attachShadow({mode: 'open'});
  }
  removeAllChildren(semanticDiv.shadowRoot);

  const style = rootDOM.querySelector('link[rel="stylesheet"]');
  semanticDiv.shadowRoot.appendChild(style);

  const symbolDOMs = rootDOM.querySelectorAll('symbol');
  for (const symbolDOM of symbolDOMs) {
    semanticDiv.shadowRoot.appendChild(symbolDOM);
  }

  for (const resDOM of getResults(rootDOM)) {
    removeNodes(resDOM, '.search-result__stats , .featured-mention , .search-result-badges , .more , .paper-actions-toggle');
    removeAttributes(resDOM, ['data-reactid', 'target']);
    semanticDiv.shadowRoot.appendChild(resDOM);
  }

  addLinkListener(semanticDiv.shadowRoot);
}

function addLinkListener(dom) {
  const links = dom.querySelectorAll('a');
  for (const ln of links) {

    ln.onclick = function () {
        chrome.tabs.create({active: true, url: replaceExtensionUrl(ln.href)});
    };
  }
}
