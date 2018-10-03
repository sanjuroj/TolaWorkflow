import IndPage from '../pages/indicators.page'
import NavBar from '../pages/navbar.page'
import TargetsTab from '../pages/targets.page'
import Util from '../lib/testutil'
import { expect } from 'chai'

describe('"Life of Program (LoP) only" target frequency', function() {
  // Disable timeouts
  this.timeout(0)

  before(function () {
    browser.windowHandleMaximize()
    Util.loginTola()
  })

  it('should permit numeric values for LoP target', function() {
    NavBar.Indicators.click()
    expect('Program Indicators' === IndPage.getPageName())
    IndPage.createBasicIndicator()

    TargetsTab.setIndicatorName('Allow numeric values')
    TargetsTab.setUnitOfMeasure('Furlongs per fortnight')
    TargetsTab.setLoPTarget(30)
    TargetsTab.setBaseline(31)
    TargetsTab.setTargetFrequency('Life of Program (LoP) only')
    // This should succeed
    TargetsTab.saveIndicatorChanges()
  })

  it('should reject non-numeric values for LoP target', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()

    TargetsTab.setIndicatorName('Disallow non-numeric values')
    TargetsTab.setUnitOfMeasure('Gold per goose')
    TargetsTab.setBaseline(49)
    TargetsTab.setTargetFrequency('Life of Program (LoP) only')

    // A string should fail
    TargetsTab.setLoPTarget('"This is a string"')
    TargetsTab.saveIndicatorChanges()
    let errorHint = TargetsTab.getLoPErrorHint()
    expect(errorHint.includes('Please enter a number larger than zero'))

    // A string that looks like a number should become a number
    TargetsTab.setLoPTarget('"59"')
    TargetsTab.saveIndicatorChanges()
    expect(59 === TargetsTab.getLoPTarget())
  })
})
