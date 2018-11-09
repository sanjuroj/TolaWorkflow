import DateMath from 'date-arithmetic'
import IndPage from '../pages/indicators.page'
import LoginPage from '../pages/login.page'
import NavBar from '../pages/navbar.page'
import TargetsTab from '../pages/targets.page'
import Util from '../lib/testutil'
import { expect } from 'chai'

describe('Adding target date ranges', function() {
  // Disable timeouts
  this.timeout(0)

  before(function() {
    browser.windowHandleMaximize()
    Util.loginTola()
  })

  it('to pre-existing annual periodic targets should produce valid date ranges', function() {
    // Create an indicator
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()

    // Set other required values
    TargetsTab.clickTargetsTab()
    TargetsTab.setTargetFrequency('Annual')
    TargetsTab.setUnitOfMeasure('Faeries per field')
    TargetsTab.setLoPTarget(43)
    TargetsTab.setBaseline(44)
    // Save changes
    TargetsTab.saveIndicatorChanges()

    // Scrape a list of date ranges off the screen
    let dateRanges = TargetsTab.getTargetDateRanges()
    let rangeStart, rangeEnd, dateObj, dateDiff
    for (let dateRange of dateRanges) {
      // Split dates into start and end date objects
      dateObj = new Date(dateRange.split(' - ')[0])
      rangeStart = DateMath.startOf(dateObj, 'year')

      dateObj = new Date(dateRange.split(' - ')[1])
      rangeEnd = DateMath.endOf(dateObj, 'year')

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'year')
      expect(1 === dateDiff)
    }

    // Save the added target and verify date ranges
    TargetsTab.saveIndicatorChanges()
    dateRanges = TargetsTab.getTargetDateRanges()
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0])
      rangeStart = DateMath.startOf(dateObj, 'year')

      dateObj = new Date(dateRange.split(' - ')[1])
      rangeEnd = DateMath.endOf(dateObj, 'year')

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'year')
      expect(1 === dateDiff)
    }

    // Make sure all the target fields are populated
    let inputBoxes = TargetsTab.getTargetInputBoxes()
    let targetCount = inputBoxes.length
    for(let inputBox of inputBoxes) {
      if ('' === inputBox.getValue()) {
        inputBox.setValue(1)
      }
    }
    // This should succeed, but we don't care so not asserting
    TargetsTab.saveIndicatorChanges()
  })

  it('to pre-existing semi-annual periodic targets should produce valid date ranges', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()
    TargetsTab.clickTargetsTab()
    TargetsTab.setTargetFrequency('Semi-annual')
    TargetsTab.setUnitOfMeasure('Gorgons per garrison')
    TargetsTab.setLoPTarget(85)
    TargetsTab.setBaseline(86)
    TargetsTab.saveIndicatorChanges()

    let dateRanges = TargetsTab.getTargetDateRanges()
    let rangeStart, rangeEnd, dateObj, dateDiff
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0])
      rangeStart = DateMath.startOf(dateObj, 'month')

      dateObj = new Date(dateRange.split(' - ')[1])
      rangeEnd = DateMath.endOf(dateObj, 'month')

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month')
      expect(6 === dateDiff)
    }

    TargetsTab.saveIndicatorChanges()
    dateRanges = TargetsTab.getTargetDateRanges()
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0])
      rangeStart = DateMath.startOf(dateObj, 'month')

      dateObj = new Date(dateRange.split(' - ')[1])
      rangeEnd = DateMath.endOf(dateObj, 'month')

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month')
      expect(6 === dateDiff)
    }

    let inputBoxes = TargetsTab.getTargetInputBoxes()
    let targetCount = inputBoxes.length
    for(let inputBox of inputBoxes) {
      if ('' === inputBox.getValue()) {
        inputBox.setValue(1)
      }
    }
    TargetsTab.saveIndicatorChanges()
  })

  it('to pre-existing tri-annual periodic targets should produce valid date ranges', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()
    TargetsTab.clickTargetsTab()
    TargetsTab.setTargetFrequency('Tri-annual')
    TargetsTab.setUnitOfMeasure('Jackalopes per juggler')
    TargetsTab.setLoPTarget(92)
    TargetsTab.setBaseline(93)
    TargetsTab.saveIndicatorChanges()

    let dateRanges = TargetsTab.getTargetDateRanges()
    let rangeStart, rangeEnd, dateObj, dateDiff
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0])
      rangeStart = DateMath.startOf(dateObj, 'month')

      dateObj = new Date(dateRange.split(' - ')[1])
      rangeEnd = DateMath.endOf(dateObj, 'month')

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month')
      expect(4 === dateDiff)
    }

    TargetsTab.saveIndicatorChanges()
    dateRanges = TargetsTab.getTargetDateRanges()
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0])
      rangeStart = DateMath.startOf(dateObj, 'month')

      dateObj = new Date(dateRange.split(' - ')[1])
      rangeEnd = DateMath.endOf(dateObj, 'month')

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month')
      expect(4 === dateDiff)
    }

    let inputBoxes = TargetsTab.getTargetInputBoxes()
    let targetCount = inputBoxes.length
    for(let inputBox of inputBoxes) {
      if ('' === inputBox.getValue()) {
        inputBox.setValue(1)
      }
    }
    TargetsTab.saveIndicatorChanges()
  })

  it('to pre-existing quarterly periodic targets should produce valid date ranges', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()
    TargetsTab.clickTargetsTab()
    TargetsTab.setTargetFrequency('Quarterly')
    TargetsTab.setUnitOfMeasure('Hairballs per hatrack')
    TargetsTab.setLoPTarget(116)
    TargetsTab.setBaseline(117)
    TargetsTab.saveIndicatorChanges()

    let dateRanges = TargetsTab.getTargetDateRanges()
    let rangeStart, rangeEnd, dateObj, dateDiff
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0])
      rangeStart = DateMath.startOf(dateObj, 'month')

      dateObj = new Date(dateRange.split(' - ')[1])
      rangeEnd = DateMath.endOf(dateObj, 'month')

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month')
      expect(3 ===  dateDiff)
    }

    TargetsTab.saveIndicatorChanges()
    dateRanges = TargetsTab.getTargetDateRanges()
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0])
      rangeStart = DateMath.startOf(dateObj, 'month')

      dateObj = new Date(dateRange.split(' - ')[1])
      rangeEnd = DateMath.endOf(dateObj, 'month')

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month')
      expect(3 ===  dateDiff)
    }

    let inputBoxes = TargetsTab.getTargetInputBoxes()
    let targetCount = inputBoxes.length
    for(let inputBox of inputBoxes) {
      if ('' === inputBox.getValue()) {
        inputBox.setValue(1)
      }
    }
    TargetsTab.saveIndicatorChanges()
  })

  it('to pre-existing monthly periodic targets should produce valid date ranges', function() {
    NavBar.Indicators.click()
    IndPage.createBasicIndicator()
    TargetsTab.clickTargetsTab()
    TargetsTab.setTargetFrequency('Monthly')
    TargetsTab.setUnitOfMeasure('Imps per invocation')
    TargetsTab.setLoPTarget(140)
    TargetsTab.setBaseline(141)
    TargetsTab.saveIndicatorChanges()

    let dateRanges = TargetsTab.getTargetDateRanges()
    let rangeStart, rangeEnd, dateObj, dateDiff
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0])
      rangeStart = DateMath.startOf(dateObj)

      dateObj = new Date(dateRange.split(' - ')[1])
      rangeEnd = DateMath.startOf(dateObj)

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month')
      expect(1 === dateDiff)
    }

    TargetsTab.saveIndicatorChanges()
    dateRanges = TargetsTab.getTargetDateRanges()
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0])
      rangeStart = DateMath.startOf(dateObj)

      dateObj = new Date(dateRange.split(' - ')[1])
      rangeEnd = DateMath.startOf(dateObj)

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month')
      expect(1 === dateDiff)
    }

    let inputBoxes = TargetsTab.getTargetInputBoxes()
    let targetCount = inputBoxes.length
    for(let inputBox of inputBoxes) {
      if ('' === inputBox.getValue()) {
        inputBox.setValue(1)
      }
    }
    TargetsTab.saveIndicatorChanges()
  })
})

