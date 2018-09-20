import IndPage from '../pages/indicators.page'
import LoginPage from '../pages/login.page'
import NavBar from '../pages/navbar.page'
import TargetsTab from '../pages/targets.page'
import Util from '../lib/testutil'
import { expect } from 'chai'

describe('Program Indicators table', function() {
  // Disable timeouts
  this.timeout(0)

  before(function() {
    browser.windowHandleMaximize()
    let parms = Util.readConfig()

    LoginPage.open(parms.baseurl)
    if (parms.baseurl.includes('mercycorps.org')) {
      LoginPage.username = parms.username
      LoginPage.password = parms.password
      LoginPage.login.click()
    } else if (parms.baseurl.includes('localhost')) {
      LoginPage.googleplus.click()
      if (LoginPage.title !== 'TolaActivity') {
        LoginPage.gUsername = parms.username + '@mercycorps.org'
        LoginPage.gPassword = parms.password
      }
    }
  })

/*
  //FIXME: Get webdriver code out of test
  it('should toggle table when a PI button is clicked', function() {
    NavBar.Indicators.click()
    Util.waitForAjax()

    let buttons = TargetsTab.getProgramIndicatorButtons()
    for (let button of buttons) {
      let targetDiv = 'div' + button.getAttribute('data-target')
      let isVisible = browser.isVisible(targetDiv)

      // If it's open, close it; start from a known state
      if (isVisible) {
        button.click()
        Util.waitForAjax()
      }
      expect(false === browser.isVisible(targetDiv))

      // Open it
      button.click()
      Util.waitForAjax()
      expect(true === browser.isVisible(targetDiv))

      // Close it again
      button.click()
      Util.waitForAjax()
      expect(false === browser.isVisible(targetDiv))
    }
  })

  it('should show a detail screen when an indicator name is clicked', function() {
    Util.waitForAjax()
    NavBar.Indicators.click()
    // Pop up indicator setup modal
    let update_buttons = browser.$$('a.indicator-link')
    console.log('update_buttons.length=', update_buttons.length)
    let update_button = update_buttons[0]
    update_button.click()
    browser.waitForVisible('h2=Indicator setup')
    // Delete it
    let delete_btn = browser.$('button#id_delete_indicator_btn')
    delete_btn.click()
  })

  it('should be able to create PI by clicking the New Indicator button', function() {
    NavBar.Indicators.click()
    IndPage.clickNewIndicatorButton()
    IndPage.saveNewIndicator()
  })

  it('should increase PI count after adding new indicator', function() {
    NavBar.Indicators.click()
    // Get old count
    let buttons = TargetsTab.getProgramIndicatorButtons()
    let buttonText = buttons[0].getText()
    let oldCount = parseInt(buttonText)

    // Create new indicator
    IndPage.clickNewIndicatorButton()
    IndPage.saveNewIndicator()
    IndPage.clickIndicatorsLink()

    // Get new count
    buttons = TargetsTab.getProgramIndicatorButtons()
    buttonText = buttons[0].getText()

    // Assert new count > old count
    let newCount = parseInt(buttonText)
    expect(oldCount + 1 === newCount)
  })
*/

  it('should be able to delete PI by clicking its Delete button', function() {
    NavBar.Indicators.click()
    IndPage.deleteIndicator()
  })

  it('should decrease PI count after deleting indicator', function() {
    NavBar.Indicators.click()
    // Get old count
    let buttons = TargetsTab.getProgramIndicatorButtons()
    let buttonText = buttons[0].getText()
    let oldCount = buttonText

    // Delete an indicator
    IndPage.deleteIndicator()

    // Get new count
    buttons = TargetsTab.getProgramIndicatorButtons()
    buttonText = buttons[0].getText()

    // Assert new count < old count
    let newCount = buttonText
    expect(newCount === oldCount - 1)
  })

  it('should edit an indicator by clicking its Edit button', function() {
    NavBar.Indicators.click()
    IndPage.editIndicator()
    expect(true === browser.isVisible('div#indicator_modal_content'))
  })
})
