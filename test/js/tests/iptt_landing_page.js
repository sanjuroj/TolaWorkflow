import IpttPage from '../pages/iptt.page'
import LoginPage from '../pages/login.page'
import NavBar from '../pages/navbar.page'
import Util from '../lib/testutil'
import { expect } from 'chai'

/**
 * IPTT report: IPTT landing page
 * Tests from mc/issues/119
 */
describe('IPTT: IPTT landing page', function() {
  // Disable timeouts
  this.timeout(0)

  before(function () {
    browser.windowHandleMaximize()
    Util.loginTola()
  })

  it('should exist', function() {
    expect('Indicator Performance Tracking Table' == IpttPage.title)
  })

  //FIXME: get webdriver code out of test
  it('should have a Program indicator overview report', function() {
    expect(browser.isVisible('form#id_form_program_indicator_overview'))
  })

  //FIXME: get webdriver code out of test
  it('should have a Program target overview report', function() {
    expect(browser.isVisible('form#id_form_program_target_overview'))
  })
})
