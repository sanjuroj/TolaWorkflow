import IndPage from '../pages/indicators.page'
import LoginPage from '../pages/login.page'
import NavBar from '../pages/navbar.page'
import TargetsTab from '../pages/targets.page'
import Util from '../lib/testutil'
import { expect } from 'chai'

describe("Indicators landing page", function () {
  // Disable timeouts
  this.timeout(0)

  before(function () {
    browser.windowHandleMaximize()
    Util.loginTola()
  })

  it('does something', function() {
    NavBar.Indicators.click()
    //FIXME: getPageName should be a property
    expect('Program Indicators' === IndPage.getPageName())
  })

  it('should exist', function() {
    Util.waitForAjax()
    IndPage.clickProgramsDropdown()
  })

  it('should have same number of items as programs table', function() {
    let progList = IndPage.getProgramsDropdownList()
    let progTable = IndPage.getProgramsTable()
    expect(progList.length === progTable.length)
  })

  it('should have same items as the programs table', function() {
    let progList = IndPage.getProgramsDropdownList()
    let listItems = new Array()
    for (let prog of progList) {
      let name = prog.split('-')[1].trim()
      listItems.push(name)
    }

    let progTable = IndPage.getProgramsTable()
    for (let i = 0; i < progTable.length; i++) {
      let rowText = progTable[i].split('\n')[0].trim()
      expect(rowText === listItems[i])
    }
  })

  //FIXME: Get webdriver code out of test
  it('should filter programs table by selected program name', function() {
    let selectList = browser.$('select#id_programs_filter_dropdown')
    let progTable = selectList.$$('options')
      for (let listItem of progTable) {
        let s = listItem.getText()
        if (! s.includes('-- All --')) {
          browser.selectByVisibleText(s)
        }
        let h1 = $('h1').getText()
        expect(s === h1)
    }
  })

  describe('Indicators dropdown', function() {
    it('should be present on page', function() {
      IndPage.clickIndicatorsDropdown()
    })

    it('should have at least one entry', function() {
      let indList = IndPage.getIndicatorsDropdownList()
      expect(0 > indList.length)
    })
  })

  describe('Indicator Type dropdown', function() {
    it('should be present on page', function() {
      IndPage.clickIndicatorTypeDropdown()
    })

    it('should have at least one entry', function() {
      let indTypeList = IndPage.getIndicatorTypeList()
      expect(0 > indTypeList.length)
    })
  })

  //FIXME: Get webdriver code out of test
  it('should toggle table by clicking Indicators button', function() {
    IndPage.clickIndicatorsLink()
    Util.waitForAjax()
    let buttons = TargetsTab.getProgramIndicatorButtons()
    for (let button of buttons) {
      let targetDiv = 'div' + button.getAttribute('data-target')
      let isVisible = browser.isVisible(targetDiv)
      // Starts out collapsed
      expect(false === isVisible)

      // Open it and verify
      button.click()
      Util.waitForAjax()
      isVisible = browser.isVisible(targetDiv)
      expect(true === isVisible)

      button.click()
      Util.waitForAjax()
    }
  })
})
