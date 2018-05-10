/**
 * Base page object
 * @module Page
 */
import { browser } from 'webdriverio'

class Page {
  constructor () {
    this.title = 'I Forgot to Change the Title'
  }
  open (path) {
    browser.url(path)
  }
}
module.exports = Page
