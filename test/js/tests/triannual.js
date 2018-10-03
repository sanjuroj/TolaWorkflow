import IndPage from '../pages/indicators.page'
//import LoginPage from '../pages/login.page'
import NavBar from '../pages/navbar.page'
import TargetsTab from '../pages/targets.page'
import Util from '../lib/testutil'
import { expect } from 'chai'

describe('Tri-annual target frequency', function() {
  // Disable timeouts
  this.timeout(0)

  before(function() {
    browser.windowHandleMaximize()
    Util.loginTola()
//    let parms = Util.readConfig()
//    LoginPage.open(parms.baseurl)
//    if (parms.baseurl.includes('mercycorps.org')) {
//      LoginPage.username = parms.username
//      LoginPage.password = parms.password
//      LoginPage.login.click()
//    } else if (parms.baseurl.includes('localhost')) {
//      LoginPage.googleplus.click()
//      if (LoginPage.title != 'Dashboard | TolaActivity') {
//        LoginPage.gUsername = parms.username + '@mercycorps.org'
//        LoginPage.gPassword = parms.password
//      }
//    }
  })

  it('should create target periods for each period requested', function() {
    IndPage.clickIndicatorsLink()
    IndPage.createBasicIndicator()

    // This should succeed
    TargetsTab.setIndicatorName('Tri-annual target, create requested targets')
    TargetsTab.setUnitOfMeasure('Krogers per Kurt')
    TargetsTab.setLoPTarget(49)
    TargetsTab.setBaseline(50)
    TargetsTab.setTargetFrequency('Tri-annual')
    TargetsTab.saveIndicatorChanges()
    expect(4 === TargetsTab.getNumTargetPeriods())
  })

  it('should require entering targets for each target period', function() {
    IndPage.clickIndicatorsLink()
    IndPage.createBasicIndicator()

    TargetsTab.setIndicatorName('Tri-annual target, target period value(s) required')
    TargetsTab.clickTargetsTab()
    TargetsTab.setUnitOfMeasure('Trouble per tribble')
    TargetsTab.setLoPTarget(308)
    TargetsTab.setBaseline(309)
    TargetsTab.saveIndicatorChanges()

    // Find the input boxes
    let inputBoxes = TargetsTab.getTargetInputBoxes()
    let targetCount = inputBoxes.length
    // Place values in each box one at a time and attempt to save.
    // This should *fail* until all the fields are filled.
    let errorCount = targetCount
    for(let inputBox of inputBoxes) {
      inputBox.setValue(82)
      TargetsTab.saveIndicatorChanges()
      // Did we fail successfully?
      let errMsg = TargetsTab.getTargetValueErrorHint()
      expect(true === errMsg.includes('Please enter a target value.'))
      errorCount--
    }
    expect(0 === errorCount)
  })
})
