import IpttPage from '../pages/iptt.page'
import LoginPage from '../pages/login.page'
import Util from '../lib/testutil'
import { expect } from 'chai'

/**
 * IPTT report: Program indicator overview report
 * Tests from mc/issues/119
 */
describe('Program indicator overview report', function() {
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

  it('should only display LoP targets, not intermediate targets', function() {
    IpttPage.open()
    // FIXME: magic number
    IpttPage.TargetOvervewProgram = 2
    let periods = [
      'Years',
      'Semi-annual periods',
      'Tri-annual periods',
      'Quarters',
      'Months'
    ]

    for (let period of periods) {
      IpttPage.TargetOverviewTimePeriods = period
      IpttPage.TargetOverviewViewReport.click()
      // validate there are no intermediate targets
      // validate that displayed LOP targets match what was input
      // validate calculations (?)
    }
  })

  it('should only display % Met for LoP targets, not intermediate targets', function() {
    IpttPage.open()
    // FIXME: magic number
    IpttPage.TargetOvervewProgram = 2
    let periods = [
      'Years',
      'Semi-annual periods',
      'Tri-annual periods',
      'Quarters',
      'Months'
    ]

    for (let period of periods) {
      IpttPage.TargetOverviewTimePeriods = period
      IpttPage.TargetOverviewViewReport.click()
      // validate there are no intermediate targets
      // validate that displayed LOP targets match what was input
      // validate calculations (?)
    }
  })
})
