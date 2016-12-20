export class Result {
  constructor(header, abst, footnote) {
    this.header = header;
    this.abst = abst;
    this.footnote = footnote;
  }

  static fromDOM(dom) {
    return new Result({},{},{});
  }
}

class ResultHeader {
  constructor(title, authors) {
    this.title = authors;
  }
}

class ResultAbstract {
  constructor(dom) {
    this.dom = dom;
  }
}

class ResultFootnote {
  constructor(dom) {
    this.dom = dom;
  }
}

