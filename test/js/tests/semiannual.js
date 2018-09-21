import IndPage from '../pages/indicators.page'
import LoginPage from '../pages/login.page'
import NavBar from '../pages/navbar.page'
import TargetsTab from '../pages/targets.page'
import Util from '../lib/testutil'
import { expect } from 'chai'

describe('"Semi-annual" target frequency', function() {
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
      if (LoginPage.title != 'TolaActivity') {
        LoginPage.gUsername = parms.username + '@mercycorps.org'
        LoginPage.gPassword = parms.password
      }
    }
  })

  it('should create target periods for each period requested', function() {
    IndPage.createBasicIndicator()

    // This should succeed
    TargetsTab.setIndicatorName('Semi-annual target create target periods testing')
    TargetsTab.setUnitOfMeasure('Llamas per lane')
    TargetsTab.setLoPTarget(358)
    TargetsTab.setBaseline(359)
    TargetsTab.saveIndicatorChanges()
  })

  it('should require entering targets for each target period', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()

    TargetsTab.setIndicatorName('Semi-annual target, target period value(s) required')
    TargetsTab.setUnitOfMeasure('Inedibles per iguana')
    TargetsTab.setLoPTarget(308)
    TargetsTab.setBaseline(309)
    TargetsTab.setTargetFrequency('Semi-annual')
    TargetsTab.saveIndicatorChanges()
    expect(3 === TargetsTab.getNumTargetPeriods())

    // Find the input boxes
    let inputBoxes = TargetsTab.getTargetInputBoxes()
    let targetCount = inputBoxes.length
    let errorMessage
    let count = 0
    while(count < targetCount) {
      inputBoxes[count].setValue(86)
      count++
    }
    TargetsTab.saveIndicatorChanges()
    expect(count === targetCount)
  })
})
