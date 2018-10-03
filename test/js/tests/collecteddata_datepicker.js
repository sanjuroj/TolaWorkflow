import TargetsTab from '../pages/targets.page'
import LoginPage from '../pages/login.page'
import Navbar from '../pages/navbar.page'
import Util from '../lib/testutil'
import {expect} from 'chai'

describe("Collected data datepicker", function () {
  // Disable timeouts
  this.timeout(0)

  before(function () {
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

  // TODO: Get the webdriver code out of the test
  describe('using clicked dates', function () {
    it('does not display a date automatically when selected', function () {
      // Open indicators page
      Navbar.Indicators.click()
      Util.waitForAjax()

      // Click the second program in the list
      let progButtons = TargetsTab.getProgramIndicatorButtons()
      let progButton = progButtons[1]
      progButton.click()
      Util.waitForAjax()

      // Click the first indicator
      let indicators = browser.$$('span.indicator_name')
      indicators[0].click()
      Util.waitForAjax()

      // Click the Add results button
      let addResults = browser.$('a[href*="/indicators/collecteddata_add/"]')
      addResults.waitForVisible()
      addResults.click()

      // Find the datepicker and confirm it is blank
      if (!browser.isVisible('div#div_id_date_collected')) {
        browser.waitForVisible('div#div_id_date_collected')
      }
      let dp = browser.$('div#div_id_date_collected')
      let curVal = dp.getText()
      expect(curVal === '')

      // Click into the datepicker and confirm the date remains blank
      dp.click()
      curVal = dp.getText()
      expect(curVal === '')

      // Move to another control
      browser.$('input#id_indicator2').click()
      curVal = dp.getText()
      expect(curVal === '')

      // Manually close the collected data modal
      browser.$('div#indicator_collecteddata_div button.close').click()
      Util.waitForAjax()
    })

    it('closes the datepicker window after selecting a date', function () {
      // Open indicators page
      Navbar.Indicators.click()
      Util.waitForAjax()

      // Click the second program in the list
      let progButtons = TargetsTab.getProgramIndicatorButtons()
      let progButton = progButtons[2]
      progButton.click()
      Util.waitForAjax()

      // Click the first indicator
      let indicators = browser.$$('span.indicator_name')
      if (indicators.length > 0) {
        indicators[0].click()
      }
      Util.waitForAjax()

      // Click the Add results button
      let addResults = browser.$('a[href*="/indicators/collecteddata_add/"]')
      addResults.waitForVisible()
      addResults.click()

      // Wait for the datepicker to appear
      if (!browser.isVisible('div#div_id_date_collected')) {
        browser.waitForVisible('div#div_id_date_collected')
      }

      // Set the date
      let dp = browser.$('div#div_id_date_collected')
      dp.click()
      if (!browser.isVisible('td.ui-datepicker-today')) {
        browser.waitForVisible('td.ui-datepicker-today')
      }
      browser.$('td.ui-datepicker-today').click()

      // Don't care about the actual value -- that's the next test--
      // just that it's changed.
      let curVal = browser.$('input#id_date_collected').getValue()
      expect(curVal !== '')
      // This test just confirms the datepicker goes away
      expect(!browser.isVisible('div#div_id_date_collected'))

      // Manually close collected data modal
      browser.$('div#indicator_collecteddata_div button.close').click()
    })

    /*
            it('chosen date appears in text box datepicker closes)
            it('assigns given value to correct period if program lifetime includes date (annual)')
            it('assigns given value to correct period if program lifetime includes date (semiannual)')
            it('assigns given value to correct period if program lifetime includes date (triannual)')
            it('assigns given value to correct period if program lifetime includes date (quarterly)')
            it('assigns given value to correct period if program lifetime includes date (monthly)')
            it('displays warning message if given date is outside program lifetime (all target periods)')
            it('does not do the hokey-pokey')
          })

          describe('using keyed-in dates', function () {
            it('closes the datepicker window after entering a date')
            it('chosen date appears in text box datepicker closes)
            it('assigns given value to correct period if program lifetime includes date (annual)')
            it('assigns given value to correct period if program lifetime includes date (semiannual)')
            it('assigns given value to correct period if program lifetime includes date (triannual)')
            it('assigns given value to correct period if program lifetime includes date (quarterly)')
            it('assigns given value to correct period if program lifetime includes date (monthly)')
            it('displays warning message if given date is outside program lifetime (all target periods)')
            it('does not do the hokey-pokey')
    */
  })
})
