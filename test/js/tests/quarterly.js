import IndPage from '../pages/indicators.page'
import LoginPage from '../pages/login.page'
import NavBar from '../pages/navbar.page'
import TargetsTab from '../pages/targets.page'
import Util from '../lib/testutil'
import { expect } from 'chai'

describe('Quarterly target frequency', function() {
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

  it('should create target periods for each period requested', function() {
    IndPage.clickIndicatorsLink()
    IndPage.createBasicIndicator()
  
    // This should succeed
    TargetsTab.setIndicatorName('Quarterly target create target periods testing')
    TargetsTab.setUnitOfMeasure('Irritants per island')
    TargetsTab.setLoPTarget(49)
    TargetsTab.setBaseline(50)
    TargetsTab.setTargetFrequency('Quarterly')
    TargetsTab.saveIndicatorChanges()
    expect(4 === TargetsTab.getNumTargetPeriods())
  })

  it('should require entering targets for each target period', function() {
    IndPage.clickIndicatorsLink()
    IndPage.createBasicIndicator()
  
    TargetsTab.setIndicatorName('Quarterly target, target period value(s) required')
    TargetsTab.setUnitOfMeasure('Weekends per worker')
    TargetsTab.setLoPTarget(65)
    TargetsTab.setBaseline(66)
    TargetsTab.setTargetFrequency('Quarterly')
    TargetsTab.saveIndicatorChanges()
  
    // Find the input boxes
    let inputBoxes = TargetsTab.getTargetInputBoxes()
    let targetCount = inputBoxes.length
    // Place values in each box one at a time and attempt to save.
    // This should *fail* until all the fields are filled.
    let errorCount = targetCount
    for(let inputBox of inputBoxes) {
      inputBox.setValue(86)
      TargetsTab.saveIndicatorChanges()
      // Did we fail successfully? If not, she's gonna blow Captain!
      let errMsg = TargetsTab.getTargetValueErrorHint()
      expect(true === errMsg.includes('Please enter a target value.'))
      errorCount--
    }
    expect(0 === errorCount)
  })
})
