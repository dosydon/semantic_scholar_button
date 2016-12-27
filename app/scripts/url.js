import URL from 'url-parse';

export function makeQueryUrl(input) {
  return `https://www.semanticscholar.org/search?&q=${input}`;
}

export function replaceExtensionUrl(url){
  const parsed = new URL(url);

  if (parsed.protocol == 'chrome-extension:') {
    return 'https://www.semanticscholar.org' + parsed.pathname;
  }else{
    return url;
  }
}

