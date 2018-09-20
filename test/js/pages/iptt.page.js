/**
 * Page object for the IPTT landing page
 * @module IpttPage
 **/
import Page from './page'
import Util from '../lib/testutil'

class IpttPage extends Page {
  get title () {
    browser.waitForVisible('nav.navbar')
    let h1 = browser.$('h1')
    return h1.getText()
  }

  // IPTT: Program indicator overview
  /**
   * Return the PROGRAM dropdown for the IPTT indicator overview
   * report as a clickable element
   * @returns {FIXME} A clickable object for the dropdown
   */
  get IndicatorOverviewProgram () {
    return browser.$('span#select2-id_timeperiods-program-container')
    //return browser.$('select#id_timeperiods-program')
  }

  get IndicatorOverviewProgramList () {
  }

  get IndicatorOverviewTimePeriods () {
    //return browser.$('select#id_timeperiods-timeperiods')
    return browser.$('li.select2-results__option')
  }

  get IndicatorOverviewTimePeriodsList () {
  }

  get IndicatorOverviewTimeFrame () {
    return browser.$('input[name="timeperiods-timeframe"]')
  }

  get IndicatorOverviewNumRecent () {
    return browser.$('input#id_timeperiods-numrecentperiods')
  }

  get IndicatorOverviewViewReport () {
    return browser.$('button#id_submit_timeperiods_button')
  }

  set IndicatorOverviewProgram (val) {
    let elem = browser.$('span#select2_id_timeperiods-program-container')
    elem.click()
    elem.selectByValue(val)
    elem.click()
  }

  set IndicatorOverviewTimeFrame (val) {
    if (val === 'Show all') {
      browser.$('div#div_id_timeperiods-timeframe_0').click()
    } else if (val === 'Most recent') {
      browser.$('div#div_id_timeperiods-timeframe_1').click()
    }
  }

  set IndicatorOverviewTimePeriods (val) {
    let elem = browser.$('select#id_timeperiods-timeperiods')
    elem.click()
    elem.selectByVisibleText(val)
    elem.click()
  }

  // IPTT: Program target overview quickstart
  get TargetOverviewProgram () {
    let div = browser.$('div#div_id_targets_program')
    // Yeah, the select2 widget does bizarre stuff to HTML markup
    return div.$('span.select2-selection')
  }

  /**
   * Return the IPTT TARGET PERIODS dropdown itself as
   * a clickable web element
   * @returns {FIXME} the target periods dropdown as a clickable
   * object
   */
  get TargetOverviewTargetPeriods () {
    let div = browser.$('div#div_id_targetperiods')
    return div.$('select#id_targetperiods-targetperiods')
  }

  get TargetOverviewTargetPeriodsList () {
  }

  get TargetOverviewTimeFrame () {
    let div = browser.$('input[name="targetperiods-timeframe"]')
    return div.$('input[name="targetperiods-timeframe"]')
  }

  get TargetOverviewNumRecent () {
    return browser.$('input#id_targetperiods-numrecentperiods')
  }

  get TargetOverviewViewReport () {
    return browser.$('button#id_submit_targetperiods_button')
  }

  set TargetOverviewProgram (val) {
    let div = browser.$('div#div_id_targets_program')
    let select = div.$('select[id="id_targetperiods-program"]')
    select.selectByIndex(val)
  }

  set TargetOverviewTimeFrame (val) {
    if (val === 'Show all') {
      let div = browser.$('div#div_id_targetperiods-timeframe_0')
      let radio = div.$('input#id_targetperiods-timeframe_0')
    } else if (val === 'Most recent') {
      let div = browser.$('div#div_id_targetperiods-timeframe_1')
      let radio = div.$('input#id_targetperiods-timeframe_1')
    }
    radio.click()
  }

  set TargetOverviewTargetPeriods (val) {
    let elem = browser.$('select[name="targetperiods-targetperiods"]')
    elem.click()
    elem.selectByVisibleText(val)
    elem.click()
  }

  open () {
    let parms = Util.readConfig()
    super.open(parms.baseurl + '/indicators/iptt_quickstart')
  }

  quickstart (source) {
    browser.waitForVisible('div#id_div_top_quickstart_iptt')
    let cards = browser.$$('div.card')
    if (source === 'indicator') {
      return cards[0].$('h5.card-title').getText()
    } else if (source === 'target') {
      return cards[1].$('h5.card-title').getText()
    }
  }

  refresh () {
    return browser.reload()
  }
}
export default new IpttPage()
