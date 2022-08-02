class HttpException extends Error {
  #httpStatusCode;
  constructor(message, httpStatusCode) {
    super(message);
    this.#httpStatusCode = httpStatusCode;
    this.name = "HttpException";
  }
  get statusCode() { return this.#httpStatusCode; }
}

class PageEditor {
  static createTable(elm) {
    const tableElm = document.createElement("table");
    elm.appendChild(tableElm);
    return tableElm;
  }
  static removeChildren(elm) {
    let child = elm.firstElementChild;
    while (child) {
      elm.removeChild(child);
      child = elm.firstElementChild;
    }
  }
}
