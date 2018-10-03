import IndPage from '../pages/indicators.page'
import NavBar from '../pages/navbar.page'
import TargetsTab from '../pages/targets.page'
import Util from '../lib/testutil'
import { expect } from 'chai'

/**
 * General number and percentage indicator tests
 * Tests from mc/issues/114, mc/issues/117, and mc/issues/144
 */
describe('Defining number and percent indicators', function() {
  // Disable timeouts
  this.timeout(0)

    before(function () {
    browser.windowHandleMaximize()
    Util.loginTola()
  })

  it('should allow to set percentage indicators', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()
    TargetsTab.setMeasureType('percent')
    let indType = TargetsTab.getMeasureType()
    expect(1 === indType)
  })

  it('should default to number indicators', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()
    TargetsTab.clickTargetsTab()
    let indType = TargetsTab.getMeasureType()
    expect(0 === indType)
  })

  it('should default number indicators to non-cumulative indicators', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()
    TargetsTab.clickTargetsTab()
    TargetsTab.setUnitOfMeasure('Soup per spoon')
    TargetsTab.setLoPTarget(55)
    TargetsTab.setBaseline(56)
    TargetsTab.setTargetFrequency('Annual')
    TargetsTab.saveIndicatorChanges()
    expect(false === TargetsTab.getMeasureIsCumulative())
  })

  it('should default percentage indicators to cumulative indicators', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()
    TargetsTab.clickTargetsTab()
    TargetsTab.setUnitOfMeasure('Ticks per tail')
    TargetsTab.setMeasureType('percent')
    TargetsTab.setLoPTarget(69)
    TargetsTab.setBaseline(70)
    TargetsTab.setTargetFrequency('Annual')
    TargetsTab.saveIndicatorChanges()
    expect(true === TargetsTab.getMeasureIsCumulative())
  })

  it('should add “%” to LoP target and Baseline fields of percentage indicators')

  it('should have direction of change option', function() {
    expect(undefined !== TargetsTab.getDirectionOfChange())
    expect(null !== TargetsTab.getDirectionOfChange())
  })

  it('should default to no direction of change', function() {
    expect('none' === TargetsTab.getDirectionOfChange())
  })
})
