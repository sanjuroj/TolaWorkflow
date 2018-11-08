/**
 * Hodgepodge of helper code that doesn't fit elsewhere
 * @module TestUtil
 */
import LoginPage from '../pages/login.page'

// Milliseconds
const delay = LoginPage.delay

/**
 * Login to a remote or local Tola instance
 * @returns Nothing
 */
function loginTola() {
  let parms = readConfig()
  LoginPage.open(parms.baseurl)
  if (parms.baseurl.includes('mercycorps.org')) {
    LoginPage.username = parms.username
    LoginPage.password = parms.password
    LoginPage.login.click()
  } else if (parms.baseurl.includes('localhost')) {
    if (parms.googleauth) {
      LoginPage.googleplus.click()
      if (LoginPage.title != 'Dashboard | TolaActivity') {
        LoginPage.gUsername = parms.username + '@mercycorps.org'
        LoginPage.gPassword = parms.password
      }
    } else {
      if (LoginPage.title != 'Dashboard | TolaActivity') {
        LoginPage.dUsername = parms.username
        LoginPage.dPassword = parms.password
        LoginPage.dLogin.click()
      }
    }
  }
}

/**
 * Read the configuration file to get user session data (username,
 * password, base URL)
 * @param {string} configFile - Path to config file; defaults to config.json
 * @returns {JSON} - JSON object containing user session data
 */
function readConfig(configFile = 'config.json') {
  let fs = require('fs')
  let data = fs.readFileSync(configFile)
  return JSON.parse(data)
}

/**
 * Print the specific string to the console
 * @param {string} s The string to print
 * @returns Nothing
 */
function dp(s) {
  console.log('***%s***', s)
}

/**
 * A function to check every secs seconds to see if one of several
 * potential AJAXey loading screens with a spinner have closed
 * @param {integer} secs Retry interval (default 2 seconds)
 * @returns Nothing
 */
function waitForAjax(secs = 2) {
  if (true === browser.isVisible('div#ajaxloading')) {
    let visible = browser.isVisible('div#ajaxloading')
    while (visible === true) {
      browser.pause(secs * msec)
      visible = browser.isVisible('div#ajaxloading')
    }
  } else if (true === browser.isVisible('div.modal-backdrop.fade')) {
    let visible = browser.isVisible('div.modal-backdrop.fade')
    while (visible === true) {
      browser.pause(secs * msec)
      visible = browser.isVisible('div.modal-backdrop.fade')
    }
  } else if (true === browser.isVisible('div.modal.ajax_loading')) {
    let visible = browser.isVisible('div.modal.ajax_loading')
    while (visible === true) {
      browser.pause(secs * msec)
      visible = browser.isVisible('div.modal.ajax_loading')
    }
  }
}

exports.dp = dp
exports.readConfig = readConfig
exports.loginTola = loginTola
exports.waitForAjax = waitForAjax
