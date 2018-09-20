import Evidence from '../pages/evidence.page'
import IndPage from '../pages/indicators.page'
import LoginPage from '../pages/login.page'
import NavBar from '../pages/navbar.page'
import TargetsTab from '../pages/targets.page'
import Util from '../lib/testutil'
import { expect } from 'chai'

/**
 * Indicator evidence table: number indicator config and display
 * Tests from mc/issues/115, mc/issues/118
 */
describe('Number indicators in the indicator evidence table', function() {
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

  it('should take LoP target of NC number indicators from LoP target field', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()
    TargetsTab.setIndicatorName('Source of LoP target')
    TargetsTab.setUnitOfMeasure('Thespains per theatre')
    TargetsTab.setMeasureType('number')
    TargetsTab.setLoPTarget(600)
    TargetsTab.setBaseline(0)
    TargetsTab.setTargetFrequency('Annual')
    TargetsTab.saveIndicatorChanges()
    TargetsTab.saveIndicatorChanges()

    let expected = TargetsTab.getLoPTarget()
    let actual = Evidence.getLoPTarget()
    expect(expected === actual)
  })

  it('should make LoP actual of NC number indicators the sum of target actuals', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()
    TargetsTab.setIndicatorName('Source of LoP actual for NC number indicators')
    TargetsTab.setUnitOfMeasure('Umpires per unit')
    TargetsTab.setMeasureType('number')
    TargetsTab.setLoPTarget(600)
    TargetsTab.setBaseline(0)
    TargetsTab.setTargetFrequency('Annual')
    TargetsTab.saveIndicatorChanges()
    TargetsTab.saveIndicatorChanges()

    let inputBoxes = TargetsTab.getTargetInputBoxes()
    // For some reason this is null
    expect(2 === inputBoxes.length)
    inputBoxes[0].setValue(100)
    inputBoxes[1].setValue(200)
    expect(300 === TargetsTab.getSumOfTargets())
  })

  it('should take LoP target of C number indicators from LoP target field', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()
    TargetsTab.setIndicatorName('Source of LoP actual for C number indicators')
    TargetsTab.setUnitOfMeasure('Umpires per unit')
    TargetsTab.setMeasureType('number')
    TargetsTab.setLoPTarget(600)
    TargetsTab.setBaseline(0)
    TargetsTab.setTargetFrequency('Annual')
    TargetsTab.saveIndicatorChanges()
    TargetsTab.saveIndicatorChanges()

    TargetsTab.clickNumberType()
    let inputBoxes = TargetsTab.getTargetInputBoxes()
    inputBoxes[0].setValue(100)
    inputBoxes[1].setValue(100)

    let lopTarget = TargetsTab.getLoPTarget()
    let lopActual = TargetsTab.getLoPTargetActual()
    expect(lopTarget === lopActual)
  })
})
