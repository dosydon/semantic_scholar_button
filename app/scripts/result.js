import { replaceExtensionUrl } from './url.js';

function removeAllChildren(elm) {
  while (elm.hasChildNodes()) {
      elm.removeChild(elm.lastChild);
	}
}

function removeAttributes(targetDOM, attribues) {
	const tw = document.createTreeWalker(targetDOM,
	NodeFilter.SHOW_ELEMENT,
	() => {
    return NodeFilter.FILTER_ACCEPT;
	},
	false);

	let node = tw.currentNode;
	if (!node) {
		retrun;
	}

  do{
    for (const attr of attribues) {
      node.removeAttribute(attr);
    }
  } while(node = tw.nextNode());
}

function removeSelectedNodes(targetDOM, selector) {
  for (const elem of targetDOM.querySelectorAll(selector)) {
    elem.remove();
  }
}

export function processRoot(rootDOM) {
  const semanticDiv = document.getElementById('semantic-scholar');
  if (!semanticDiv.shadowRoot) {
    semanticDiv.attachShadow({mode: 'open'});
  }

  removeAllChildren(semanticDiv.shadowRoot);

  semanticDiv.shadowRoot.appendChild(rootDOM.querySelector('link[rel="stylesheet"]'));
  for (const symbolDOM of rootDOM.querySelectorAll('symbol')) {
    semanticDiv.shadowRoot.appendChild(symbolDOM);
  }

  for (const resDOM of rootDOM.getElementsByClassName('search-result')) {
    removeSelectedNodes(resDOM, '.search-result__stats , .featured-mention , .search-result-badges , .more , .paper-actions-toggle');
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
