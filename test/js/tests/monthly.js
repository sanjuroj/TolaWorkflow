import IndPage from '../pages/indicators.page'
import NavBar from '../pages/navbar.page'
import TargetsTab from '../pages/targets.page'
import Util from '../lib/testutil'
import { expect } from 'chai'

describe('Monthly target frequency', function() {
  // Disable timeouts
  this.timeout(0)

  before(function () {
    browser.windowHandleMaximize()
    Util.loginTola()
  })

  it('should require entering targets for each target period', function() {
  IndPage.clickIndicatorsLink()
  IndPage.createBasicIndicator()

  TargetsTab.setIndicatorName('Monthly target, target period value(s) required')
  TargetsTab.setUnitOfMeasure('Zebras per zoo')
  TargetsTab.setLoPTarget(57)
  TargetsTab.setBaseline(58)
  TargetsTab.setTargetFrequency('Monthly')
  TargetsTab.saveIndicatorChanges()

  // Find the input boxes
  let inputBoxes = TargetsTab.getTargetInputBoxes()
  let targetCount = inputBoxes.length
  // Place values in each box one at a time and attempt to save.
  // This should *fail* until all the fields are filled.
  let errorCount = targetCount
  for(let inputBox of inputBoxes) {
    inputBox.setValue(78)
    TargetsTab.saveIndicatorChanges()
    // Did we fail successfully? If not, she's gonna blow Captain!
    let errMsg = TargetsTab.getTargetValueErrorHint()
    expect(true === errMsg.includes('Please enter a target value.'))
    errorCount--
  }
  expect(0 === errorCount)
  })
})

