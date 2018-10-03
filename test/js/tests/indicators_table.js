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
      if (LoginPage.title != 'Dashboard | TolaActivity') {
        LoginPage.gUsername = parms.username + '@mercycorps.org'
        LoginPage.gPassword = parms.password
      }
    }
  })

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

  //FIXME: Get webdriver code out of test
  it('should show a detail screen when an indicator name is clicked', function() {
    NavBar.Indicators.click()
    Util.waitForAjax()

    // Get a list of the programs in the table
    let progButtons = TargetsTab.getProgramIndicatorButtons()
    let progButton = progButtons[0]
    let targetDiv = 'div' + progButton.getAttribute('data-target')
    
    // If it's open, close it; start from a known state
    let isVisible = browser.isVisible(targetDiv)
    if (isVisible) {
        progButton.click()
    }
    // Wait for the spinner to go away
    Util.waitForAjax()
    expect(false === browser.isVisible(targetDiv))

    // Open it
    progButton.click()
    Util.waitForAjax()
    expect(true === browser.isVisible(targetDiv))


    // Open the indicator setup modal of the first indicator
    // in the table
    let updateButtons = browser.$$('a.indicator-link')
    let updateButton = updateButtons[0]
    let dialog = 'div#indicator_modal_div'
    updateButton.click()
    browser.waitForVisible('h2=Indicator setup')
    let modal = browser.$(dialog)
    modal.$('button.close').click()
    if(browser.isVisible(dialog)) {
        browser.waitForVisible(dialog, false)
    }
  })

  it('should be able to create PI by clicking the New Indicator button', function() {
    Util.waitForAjax()
    NavBar.Indicators.click()
    Util.waitForAjax()
    IndPage.clickNewIndicatorButton()
    expect(browser.$('h1#page-title') === 'Add indicator')

    IndPage.saveNewIndicator()
    expect(browser.$('div.alert.alert-success').getText() != '')
    expect(browser.$('div.alert.alert-success').getText() != null)
  })

  it('should increase PI count after adding new indicator', function() {
    NavBar.Indicators.click()
    // Get old count
    let buttons = TargetsTab.getProgramIndicatorButtons()
    let buttonText = buttons[1].getText()
    let oldCount = parseInt(buttonText)

    // Create new indicator
    IndPage.clickNewIndicatorButton()
    IndPage.saveNewIndicator()
    IndPage.clickIndicatorsLink()

    // Get new count
    buttons = TargetsTab.getProgramIndicatorButtons()
    buttonText = buttons[1].getText()

    // Assert new count > old count
    let newCount = parseInt(buttonText)
    expect(oldCount + 1 === newCount)
  })

  it('should be able to delete PI by clicking its Delete button', function() {
    NavBar.Indicators.click()
    let buttons = TargetsTab.getProgramIndicatorButtons()
    let buttonText = buttons[0].getText()
    let oldCount = buttonText

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
    Util.waitForAjax()
    IndPage.editIndicator()
    expect(true === browser.isVisible('div#indicator_modal_content'))
  })
})
