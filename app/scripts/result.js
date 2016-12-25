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

function getResults(rootDOM){
  const arr = [];
  const results = rootDOM.getElementsByClassName('search-result');
  for (let res of results){
    arr.push(res);
  }
  return arr;
}

export function processRoot(rootDOM) {
  const semanticDiv = document.getElementById('semantic-scholar');
  if (!semanticDiv.shadowRoot) {
    semanticDiv.attachShadow({mode:'open'});
  }
  removeAllChildren(semanticDiv.shadowRoot);

  const style = rootDOM.querySelector('link[rel="stylesheet"]');
  semanticDiv.shadowRoot.appendChild(style);

  const symbolDOMs = rootDOM.querySelectorAll('symbol');
  for (let symbolDOM of symbolDOMs) {
    semanticDiv.shadowRoot.appendChild(symbolDOM);
  }

  for (let resDOM of getResults(rootDOM)) {
    removeNodes(resDOM,'.search-result__stats , .featured-mention , .search-result-badges , .more , .paper-actions-toggle');
    removeAttributes(resDOM,['data-reactid','target']);
    semanticDiv.shadowRoot.appendChild(resDOM);
  }
}
