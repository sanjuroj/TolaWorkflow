import IndPage from '../pages/indicators.page'
import LoginPage from '../pages/login.page'
import NavBar from '../pages/navbar.page'
import TargetsTab from '../pages/targets.page'
import Util from '../lib/testutil'
import { expect } from 'chai'

describe('Monthly target frequency', function() {
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

  it('should require date that first target period begins', function() {
  IndPage.open()
  expect('Program Indicators' === IndPage.getPageName())
  IndPage.createBasicIndicator()

  // This should succeed
  TargetsTab.setIndicatorName('Annual target first period required testing')
  TargetsTab.setUnitOfMeasure('Hawks per hectare')
  TargetsTab.setLoPTarget(29)
  TargetsTab.setBaseline(30)
  TargetsTab.setTargetFrequency('Annual')

  // Trying to save without setting the start date should fail
  TargetsTab.saveIndicatorChanges()
  let errorMessage = TargetsTab.getTargetFirstPeriodErrorHint()
  expect(true === errorMessage.includes('Please complete this field.'))
  })

  it('should default number of periods to 1', function() {
  expect(1 === TargetsTab.getNumTargetPeriods())
  })

  it('should create target periods for each period requested', function() {
  TargetsTab.setNumTargetPeriods(12)
  TargetsTab.saveIndicatorChanges()
  expect(12 === TargetsTab.getNumTargetPeriods())
  })

  it('should require entering targets for each target period', function() {
  IndPage.clickIndicatorsLink()
  IndPage.createBasicIndicator()

  TargetsTab.setIndicatorName('Monthly target, target period value(s) required')
  TargetsTab.setUnitOfMeasure('Zebras per zoo')
  TargetsTab.setLoPTarget(57)
  TargetsTab.setBaseline(58)
  TargetsTab.setTargetFrequency('Monthly')
  TargetsTab.setNumTargetPeriods(5)
  TargetsTab.setFirstTargetPeriod()
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

