import URL from 'url-parse';

export function makeQueryUrl(input) {
  return `https://www.semanticscholar.org/search?&q=${input}`;
}

export function isExtensionUrl(url) {
  const parsed = new URL(ln.href);
  return parsed.protocol == 'chrome-extension:';
}

