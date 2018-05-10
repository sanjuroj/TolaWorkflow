/**
 * Base page object
 * @module Page
 */
class Page {
  constructor() {
  }
  open(path) {
    browser.url(path)
  }
}
module.exports = Page
