/**
 * Page model and methods for dealing with the MercyCorps
 * SSO login page
 * @module LoginPage
 */
import Page from './page'

// Milliseconds
const delay = 1000

class LoginPage extends Page {
  // Independent of auth source
  get title () { return browser.getTitle() }

  // These are for authentication using Django's built-in auth on
  // a local instance; parms.auth = 'django'
  get dUsername () { return browser.$('#id_username') }
  get dPassword () { return browser.$('#id_password') }
  get dLogin () {
    let inputs = browser.$$('input')
    for (let input of inputs) {
      if (input.getValue() === 'login') {
          return input
      }
    }
  }
  set dUsername (val) { return browser.$('#id_username').setValue(val) }
  set dPassword (val) { return browser.$('#id_password').setValue(val) }

  // These are for authentication using MC's SSO; parms.auth = 'mcsso'
  get username () { return browser.$('#login') }
  get password () { return browser.$('#password') }
  get login () { return browser.$('.inputsub') }
  get error () { return browser.getText('#error') }

  set username (val) { return browser.$('#login').setValue(val) }
  set password (val) { return browser.$('#password').setValue(val) }

  // These are for authenticating using GoogleAuth on a local instance;
  // parms.auth = 'google'
  get gUsername () { return browser.$('form').$('input#identifierId') }
  get gPassword () { return browser.$('form').$('input.whsOnd.zHQkBf') }
  get googleplus () { return browser.$('=Google+') }
  get gError () { return browser.$('div.dEOOab.RxsGPe').getText() }

  // The hard delays are necessary because Google
  set gUsername (val) {
    browser.waitForVisible('input#identifierId')
    // Works on chrome and firefox
    browser.$('form').$('input#identifierId').setValue(val)
    browser.waitForVisible('div#identifierNext')
    browser.$('div#identifierNext').click()
    browser.pause(delay)
  }

  // The hard delays are necessary because Google
  set gPassword (val) {
    browser.waitForVisible('input[name="password"]')
    // Works on chrome and firefox
    browser.$('input[name="password"]').setValue(val)
    browser.pause(delay)
    browser.waitForVisible('div#passwordNext')
    browser.$('div#passwordNext').click()
    browser.pause(delay)
    browser.waitUntil(function () {
      let url = browser.getUrl()
      if (url.includes('mercycorps') || url.includes('localhost')) {
        return url
      }
    })
  }

  open (url) { super.open(url) }
}
export default new LoginPage()
