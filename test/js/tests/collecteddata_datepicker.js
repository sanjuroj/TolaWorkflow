import TargetsTab from '../pages/targets.page'
import Navbar from '../pages/navbar.page'
import Util from '../lib/testutil'
import {expect} from 'chai'

describe("Collected data datepicker", function () {
  // Disable timeouts
  this.timeout(0)

  before(function () {
    browser.windowHandleMaximize()
    Util.loginTola()
  })

  // TODO: Get the webdriver code out of the test
  describe('using clicked dates', function () {
    it('does not display a date automatically when selected', function () {
      // Open indicators page
      Navbar.Indicators.click()
      Util.waitForAjax()

      // Click the third program in the list
      let progButtons = TargetsTab.getProgramIndicatorButtons()
      let progButton = progButtons[2]
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
      let curVal = dp.getValue()
      expect(curVal === '')

      // Click into the datepicker and confirm the date remains blank
      dp.click()
      curVal = dp.getValue()
      expect(curVal === '')

      // Move to another control
      browser.$('input#id_indicator2').click()
      curVal = dp.getValue()
      expect(curVal === '')

      // Manually close the collected data modal
      browser.$('div#indicator_collecteddata_div button.close').click()
      Util.waitForAjax()
    })

    it('closes the datepicker window after selecting a date', function () {
      Navbar.Indicators.click()
      Util.waitForAjax()

      let progButtons = TargetsTab.getProgramIndicatorButtons()
      let progButton = progButtons[2]
      progButton.click()
      Util.waitForAjax()

      let indicators = browser.$$('span.indicator_name')
      if (indicators.length > 0) {
        indicators[0].click()
      }
      Util.waitForAjax()

      let addResults = browser.$('a[href*="/indicators/collecteddata_add/"]')
      addResults.waitForVisible()
      addResults.click()

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

      // Don't care about the value, just that it changed
      let curVal = browser.$('input#id_date_collected').getValue()
      expect(curVal !== '')

      // Pop up should disappear after selecting a date
      expect(!browser.isVisible('div#div_id_date_collected'))

      browser.$('div#indicator_collecteddata_div button.close').click()
      Util.waitForAjax()
    })

    it.skip('chosen date appears in text box datepicker closes')
    it.skip('assigns given value to correct period if program lifetime includes date (annual)')
    it.skip('assigns given value to correct period if program lifetime includes date (semiannual)')
    it.skip('assigns given value to correct period if program lifetime includes date (triannual)')
    it.skip('assigns given value to correct period if program lifetime includes date (quarterly)')
    it.skip('assigns given value to correct period if program lifetime includes date (monthly)')
    it.skip('displays warning message if given date is outside program lifetime (all target periods)')
    it.skip('does not do the hokey-pokey', function() {
        expect(true)
    })
  })

  describe('using keyed-in dates', function () {
    it.skip('closes the datepicker window after entering a date')
    it.skip('chosen date appears in text box datepicker closes')
    it.skip('assigns given value to correct period if program lifetime includes date (annual)')
    it.skip('assigns given value to correct period if program lifetime includes date (semiannual)')
    it.skip('assigns given value to correct period if program lifetime includes date (triannual)')
    it.skip('assigns given value to correct period if program lifetime includes date (quarterly)')
    it.skip('assigns given value to correct period if program lifetime includes date (monthly)')
    it.skip('displays warning message if given date is outside program lifetime (all target periods)')
    it.skip('does not do the hokey-pokey')
  })

})
