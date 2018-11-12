import IndPage from '../pages/indicators.page'
import LoginPage from '../pages/login.page'
import NavBar from '../pages/navbar.page'
import TargetsTab from '../pages/targets.page'
import Util from '../lib/testutil'
import { expect } from 'chai'

describe('"Annual" target frequency', function() {
  // Disable timeouts
  this.timeout(0)

  before(function() {
    browser.windowHandleMaximize()
    Util.loginTola()
  })

  it('should create target periods for each period requested', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()

    TargetsTab.setIndicatorName('Annual target, create target periods')
    TargetsTab.setUnitOfMeasure('Inkblots per Injunction')
    TargetsTab.setLoPTarget(293)
    TargetsTab.setBaseline(294)
    TargetsTab.setTargetFrequency('Annual')

    // This should succeed
    TargetsTab.saveIndicatorChanges()
    expect(2 === TargetsTab.getNumTargetPeriods())
  })

  it('should require entering targets for each target period', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()

    TargetsTab.setIndicatorName('Annual target, target period value(s) required')
    TargetsTab.setUnitOfMeasure('Inedibles per iguana')
    TargetsTab.setLoPTarget(308)
    TargetsTab.setBaseline(309)
    TargetsTab.setTargetFrequency('Annual')
    TargetsTab.saveIndicatorChanges()

    // Find the input boxes
    let inputBoxes = TargetsTab.getTargetInputBoxes()
    let targetCount = inputBoxes.length
    // Place values in each box one at a time and attempt to save.
    // This should *fail* until all the fields are filled.
    let errMsg
    let errorCount = targetCount;
    for(let inputBox of inputBoxes) {
      inputBox.setValue(86)
      TargetsTab.saveIndicatorChanges()
      // Did we fail successfully? If not, she's gonna blow Captain!
      errMsg = TargetsTab.getTargetValueErrorHint()
      expect(errMsg.includes('Please enter a target value.'))
      errorCount--
    }
    expect(0 === errorCount)
  })
})
