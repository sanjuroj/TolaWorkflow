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

  it('should require entering the date that first period begins', function() {
    NavBar.Indicators.click()
    expect('Program Indicators' === IndPage.getPageName())
    IndPage.createBasicIndicator()
  
    TargetsTab.setIndicatorName('Semi-annual target, first period start date required')
    TargetsTab.setUnitOfMeasure('Klingons per kiloton')
    TargetsTab.setLoPTarget(30)
    TargetsTab.setBaseline(31)
    TargetsTab.setTargetFrequency('Semi-annual')
  
    // Trying to save without setting the start date should fail
    TargetsTab.saveIndicatorChanges()
    let errorMessage = TargetsTab.getTargetFirstPeriodErrorHint()
    expect(true === errorMessage.includes('Please complete this field.'))
  })

  it('should default number of periods to 1', function() {
    expect(1 === TargetsTab.getNumTargetPeriods())
  })

  it('should create target periods for each period requested', function() {
    IndPage.createBasicIndicator()

    // This should succeed
    TargetsTab.setIndicatorName('Semi-annual target create target periods testing')
    TargetsTab.setUnitOfMeasure('Llamas per lane')
    TargetsTab.setLoPTarget(358)
    TargetsTab.setBaseline(359)
    TargetsTab.setTargetFrequency('Semi-annual')
    TargetsTab.setNumTargetPeriods(3)

    TargetsTab.saveIndicatorChanges()
    expect(3 === TargetsTab.getNumTargetPeriods())
  })

  it('should require entering targets for each target period', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()

    TargetsTab.setIndicatorName('Semi-annual target, target period value(s) required')
    TargetsTab.setUnitOfMeasure('Inedibles per iguana')
    TargetsTab.setLoPTarget(308)
    TargetsTab.setBaseline(309)
    TargetsTab.setTargetFrequency('Semi-annual')
    TargetsTab.setFirstTargetPeriod()
    TargetsTab.setNumTargetPeriods(3)
    TargetsTab.saveIndicatorChanges()
    expect(3 === TargetsTab.getNumTargetPeriods())

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
      expect(true === errMsg.includes('Please enter a target value.'))
      errorCount--
    }
    expect(0 === errorCount)
  })
})
