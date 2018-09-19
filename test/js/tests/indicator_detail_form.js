import IndPage from '../pages/indicators.page'
import LoginPage from '../pages/login.page'
import NavBar from '../pages/navbar.page'
import TargetsTab from '../pages/targets.page'
import Util from '../lib/testutil'
import { expect } from 'chai'

describe('Indicator creation detail form', function() {
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

  //FIXME: Get the webdriver code out of the test
  it('should exist', function() {
  NavBar.Indicators.click()
  expect('Program Indicators' === IndPage.getPageName())
  IndPage.createBasicIndicator()
  browser.waitForVisible('h1')
  let title = browser.$('h1').getText().trim()
  expect(true === title.includes('Goal indicator: Temporary'))
  })

  //FIXME: Get the webdriver code out of the test
  describe('Summary tab', function() {
    it('should exist', function() {
      expect(true === browser.isVisible('=Summary'))
    })
  })

  //FIXME: Get the webdriver code out of the test
  describe('Performance tab', function() {
    it('should exist', function() {
      expect(true === browser.isVisible('=Performance'))
    })
  }) // end performance tab tests

  //FIXME: Get the webdriver code out of the test
  describe('Targets tab', function() {
    it('should exist', function() {
      expect(true === browser.isVisible('=Targets'))
    })
  }) // end targets tab tests

  //FIXME: Get the webdriver code out of the test
  describe('Data Acquisition tab', function() {
    it('should exist', function() {
      expect(true === browser.isVisible('=Data Acquisition'))
    })
  }) // end data acquistion tab tests

  //FIXME: Get the webdriver code out of the test
  describe('Analysis and Reporting tab', function() {
    it('should exist', function() {
      expect(true === browser.isVisible('=Analysis and Reporting'))
    })
  }) // end analysis tab tests

  //FIXME: Get the webdriver code out of the test
  describe('Approval tab', function() {
    it('should exist', function() {
      expect(true === browser.isVisible('=Approval'))
    })
  }) // end approval tab tests

  //FIXME: Get the webdriver code out of the test
  it('should have a Help link', function() {
    expect(true === browser.isVisible('=Help'))
  })

  //FIXME: Get the webdriver code out of the test
  it('should have a Save Changes button', function() {
    expect(true === browser.isVisible('=Save changes'))
  })

  //FIXME: Get the webdriver code out of the test
  it('should have a Reset button', function() {
    expect(true === browser.isVisible('=RESET'))
  })

  //FIXME: Get the webdriver code out of the test
  it('should restore form to pre-edit state when RESET button is clicked', function() {
    let select = browser.$('select#id_sector')
    let options = select.$$('option')
    //FIXME: magic number
    let option = options[1]
    let origVal = option.getValue()

    // 2 - Basic Needs
    //FIXME: magic number
    select.selectByValue(2)
    let newVal =  select.getValue()
    expect(2 === newVal)
    IndPage.clickResetButton()
    //FIXME: magic number
    let resetVal = options[1].getValue()
    expect(origVal === resetVal)
  })
})
