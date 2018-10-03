/**
 * Hodgepodge of helper code that doesn't fit elsewhere
 * @module TestUtil
 */

// Milliseconds
const msec = 1000

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
 * A function to check every secs seconds to see if
 * an ajax loading screen with a spinner has closed
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
  }
  if (true === browser.isVisible('div.modal-backdrop.fade')) {
    let visible = browser.isVisible('div.modal-backdrop.fade')
    while (visible === true) {
      browser.pause(secs * msec)
      visible = browser.isVisible('div.modal-backdrop.fade')
    }
  }
  if (true === browser.isVisible('div.modal.ajax_loading')) {
    let visible = browser.isVisible('div.modal.ajax_loading')
    while (visible === true) {
      browser.pause(secs * msec)
      visible = browser.isVisible('div.modal.ajax_loading')
    }
  }
}

exports.dp = dp
exports.readConfig = readConfig
exports.waitForAjax = waitForAjax
