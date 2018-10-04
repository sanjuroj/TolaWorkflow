import TargetsTab from '../pages/targets.page'
import Navbar from '../pages/navbar.page'
import Util from '../lib/testutil'
import dateFormat from 'dateformat'
import {expect} from 'chai'

describe("Collected data datepicker", function () {
  // Disable timeouts
  this.timeout(0)

  before(function () {
    browser.windowHandleMaximize()
    Util.loginTola()
  })

  // TODO: Get the webdriver code out of the tests
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

    it('chosen date appears in text box after datepicker closes', function() {
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

      let now = new Date(Date.now())
      let sysDate = dateFormat(now,'yyyy-mm-dd')
      let dpDate = browser.$('input#id_date_collected').getValue()
      expect(sysDate === dpDate)

      // Pop up should disappear after selecting a date
      expect(!browser.isVisible('div#div_id_date_collected'))

      browser.$('div#indicator_collecteddata_div button.close').click()
      Util.waitForAjax()
    })

    it.skip('assigns given value to correct period if program lifetime includes date (annual)')
    it.skip('assigns given value to correct period if program lifetime includes date (semiannual)')
    it.skip('assigns given value to correct period if program lifetime includes date (triannual)')
    it.skip('assigns given value to correct period if program lifetime includes date (quarterly)')
    it.skip('assigns given value to correct period if program lifetime includes date (monthly)')

    it('displays warning if given date is outside program lifetime (all target periods)', function() {
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

      // Warning message should appear below the datepicker text box
      expect(browser.isVisible('small#hint_id_date_collected'))

      browser.$('div#indicator_collecteddata_div button.close').click()
      Util.waitForAjax()
    })

    it('does not do the hokey-pokey', function() {
        expect(true)
    })
  })

  describe('using keyed-in dates', function () {
    it('closes the datepicker window after keying in a date', function () {
      Navbar.Indicators.click()
      Util.waitForAjax()

      let progButtons = TargetsTab.getProgramIndicatorButtons()
      let progButton = progButtons[1]
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

      // Have to use the input element here because that's the, um, input
      // source for the keyboard...
      let dp = browser.$('input#id_date_collected')
      // Set the date
      let now = new Date(Date.now())
      let sysDate = dateFormat(now, 'yyyy-mm-dd')
      dp.setValue(sysDate)


      let curVal = browser.$('input#id_date_collected').getValue()
      expect(curVal === sysDate)

      // Datepicker should not be visible
      expect(!browser.isVisible('div#div_id_date_collected'))

      browser.$('div#indicator_collecteddata_div button.close').click()
      Util.waitForAjax()
    })

    it('chosen date appears in text box after datepicker closes', function() {
      Navbar.Indicators.click()
      Util.waitForAjax()

      let progButtons = TargetsTab.getProgramIndicatorButtons()
      let progButton = progButtons[1]
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

      // Have to use the input element here because that's the, um, input
      // source for the keyboard...
      let dp = browser.$('input#id_date_collected')
      // Set the date
      let spookyDate = '2018-10-31'
      dp.setValue(spookyDate)

      // Pop up should disappear after selecting a date
      expect(!browser.isVisible('div#div_id_date_collected'))

      // These should match
      let curVal = browser.$('input#id_date_collected').getValue()
      expect(curVal === spookyDate)

      browser.$('div#indicator_collecteddata_div button.close').click()
      Util.waitForAjax()
    })

    it.skip('assigns given value to correct period if program lifetime includes date (annual)')
    it.skip('assigns given value to correct period if program lifetime includes date (semiannual)')
    it.skip('assigns given value to correct period if program lifetime includes date (triannual)')
    it.skip('assigns given value to correct period if program lifetime includes date (quarterly)')
    it.skip('assigns given value to correct period if program lifetime includes date (monthly)')
    it.skip('displays warning if given date is outside program lifetime (all target periods)')

    it('does not do the hokey-pokey', function() {
        expect(true)
    })
  })

})
