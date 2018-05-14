import DateMath from 'date-arithmetic';
import IndPage from '../pages/indicators.page';
import LoginPage from '../pages/login.page';
import NavBar from '../pages/navbar.page';
import TargetsTab from '../pages/targets.page';
import Util from '../lib/testutil';
import { expect } from 'chai';

describe('Adding target date ranges', function() {
  this.timeout(0);

  before(function() {
    // Disable timeouts
    browser.windowHandleMaximize();
    let parms = Util.readConfig();
              
    LoginPage.open(parms.baseurl);
    if (parms.baseurl.includes('mercycorps.org')) {
      LoginPage.username = parms.username;
      LoginPage.password = parms.password;
      LoginPage.login.click();
    } else if (parms.baseurl.includes('localhost')) {
      LoginPage.googleplus.click();
      if (LoginPage.title != 'TolaActivity') {
        LoginPage.gUsername = parms.username + '@mercycorps.org';
        LoginPage.gPassword = parms.password;
      }
    }
  });

  it('to pre-existing annual periodic targets should produce valid date ranges', function() {
    NavBar.Indicators.click();  
    IndPage.createBasicIndicator();
    TargetsTab.clickTargetsTab();
    TargetsTab.setTargetFrequency('Annual');
    // Set first period to current month
    TargetsTab.setFirstTargetPeriod();
    // Set number of target periods to 1
    TargetsTab.setNumTargetPeriods(1);
    // Set other required values
    TargetsTab.setUnitOfMeasure('Faeries per field');
    TargetsTab.setLoPTarget(43);
    TargetsTab.setBaseline(44);
    // Save changes
    TargetsTab.saveIndicatorChanges();

    // Scrape a list of date ranges off the screen
    let dateRanges = TargetsTab.getTargetDateRanges();
    // Add a target and verify date ranges
    TargetsTab.addTarget();
    let rangeStart, rangeEnd, dateObj, dateDiff;
    for (let dateRange of dateRanges) {
      // Split dates into start and end date objects
      dateObj = new Date(dateRange.split(' - ')[0]);
      rangeStart = DateMath.startOf(dateObj, 'year');

      dateObj = new Date(dateRange.split(' - ')[1]);
      rangeEnd = DateMath.endOf(dateObj, 'year');

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'year');
      expect(1 === dateDiff);
    }

    // Save the added target and verify date ranges
    TargetsTab.saveIndicatorChanges();
    dateRanges = TargetsTab.getTargetDateRanges();
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0]);
      rangeStart = DateMath.startOf(dateObj, 'year');

      dateObj = new Date(dateRange.split(' - ')[1]);
      rangeEnd = DateMath.endOf(dateObj, 'year');

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'year');
      expect(1 === dateDiff);
    }

    // Make sure all the target fields are populated
    let inputBoxes = TargetsTab.getTargetInputBoxes();
    let targetCount = inputBoxes.length;
    for(let inputBox of inputBoxes) {
      if ('' == inputBox.getValue()) {
        inputBox.setValue(1);
      }
    }
    // This should succeed, but we don't care so not asserting
    TargetsTab.saveIndicatorChanges();
  });

  it('to pre-existing semi-annual periodic targets should produce valid date ranges', function() {
    NavBar.Indicators.click();  
    IndPage.createBasicIndicator();
    TargetsTab.clickTargetsTab();
    TargetsTab.setTargetFrequency('Semi-annual');
    TargetsTab.setFirstTargetPeriod();
    TargetsTab.setNumTargetPeriods(1);
    TargetsTab.setUnitOfMeasure('Gorgons per garrison');
    TargetsTab.setLoPTarget(85);
    TargetsTab.setBaseline(86);
    TargetsTab.saveIndicatorChanges();

    let dateRanges = TargetsTab.getTargetDateRanges();
    TargetsTab.addTarget();
    let rangeStart, rangeEnd, dateObj, dateDiff;
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0]);
      rangeStart = DateMath.startOf(dateObj, 'month');

      dateObj = new Date(dateRange.split(' - ')[1]);
      rangeEnd = DateMath.endOf(dateObj, 'month');

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month');
      expect(6 === dateDiff);
    }

    TargetsTab.saveIndicatorChanges();
    dateRanges = TargetsTab.getTargetDateRanges();
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0]);
      rangeStart = DateMath.startOf(dateObj, 'month');

      dateObj = new Date(dateRange.split(' - ')[1]);
      rangeEnd = DateMath.endOf(dateObj, 'month');

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month');
      expect(6 === dateDiff);
    }

    let inputBoxes = TargetsTab.getTargetInputBoxes();
    let targetCount = inputBoxes.length;
    for(let inputBox of inputBoxes) {
      if (inputBox.getValue() == '') {
        inputBox.setValue(1);
      }
    }
    TargetsTab.saveIndicatorChanges();
  });

  it('to pre-existing tri-annual periodic targets should produce valid date ranges', function() {
    NavBar.Indicators.click();  
    IndPage.createBasicIndicator();
    TargetsTab.clickTargetsTab();
    TargetsTab.setTargetFrequency('Tri-annual');
    TargetsTab.setFirstTargetPeriod();
    TargetsTab.setNumTargetPeriods(1);
    TargetsTab.setUnitOfMeasure('Jackalopes per juggler');
    TargetsTab.setLoPTarget(92);
    TargetsTab.setBaseline(93);
    TargetsTab.saveIndicatorChanges();

    let dateRanges = TargetsTab.getTargetDateRanges();
    TargetsTab.addTarget();
    let rangeStart, rangeEnd, dateObj, dateDiff;
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0]);
      rangeStart = DateMath.startOf(dateObj, 'month');

      dateObj = new Date(dateRange.split(' - ')[1]);
      rangeEnd = DateMath.endOf(dateObj, 'month');

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month');
      expect(4 === dateDiff);
    }

    TargetsTab.saveIndicatorChanges();
    dateRanges = TargetsTab.getTargetDateRanges();
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0]);
      rangeStart = DateMath.startOf(dateObj, 'month');

      dateObj = new Date(dateRange.split(' - ')[1]);
      rangeEnd = DateMath.endOf(dateObj, 'month');

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month');
      expect(4 === dateDiff);
    }

    let inputBoxes = TargetsTab.getTargetInputBoxes();
    let targetCount = inputBoxes.length;
    for(let inputBox of inputBoxes) {
      if (inputBox.getValue() == '') {
        inputBox.setValue(1);
      }
    }
    TargetsTab.saveIndicatorChanges();
  });

  it('to pre-existing quarterly periodic targets should produce valid date ranges', function() {
    NavBar.Indicators.click();  
    IndPage.createBasicIndicator();
    TargetsTab.clickTargetsTab();
    TargetsTab.setTargetFrequency('Quarterly');
    TargetsTab.setFirstTargetPeriod();
    TargetsTab.setNumTargetPeriods(1);
    TargetsTab.setUnitOfMeasure('Hairballs per hatrack');
    TargetsTab.setLoPTarget(116);
    TargetsTab.setBaseline(117);
    TargetsTab.saveIndicatorChanges();

    let dateRanges = TargetsTab.getTargetDateRanges();
    TargetsTab.addTarget();
    let rangeStart, rangeEnd, dateObj, dateDiff;
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0]);
      rangeStart = DateMath.startOf(dateObj, 'month');

      dateObj = new Date(dateRange.split(' - ')[1]);
      rangeEnd = DateMath.endOf(dateObj, 'month');

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month');
      expect(3 ===  dateDiff);
    }

    TargetsTab.saveIndicatorChanges();
    dateRanges = TargetsTab.getTargetDateRanges();
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0]);
      rangeStart = DateMath.startOf(dateObj, 'month');

      dateObj = new Date(dateRange.split(' - ')[1]);
      rangeEnd = DateMath.endOf(dateObj, 'month');

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month');
      expect(3 ===  dateDiff);
    }

    let inputBoxes = TargetsTab.getTargetInputBoxes();
    let targetCount = inputBoxes.length;
    for(let inputBox of inputBoxes) {
      if (inputBox.getValue() == '') {
        inputBox.setValue(1);
      }
    }
    TargetsTab.saveIndicatorChanges();
  });

  it('to pre-existing monthly periodic targets should produce valid date ranges', function() {
    NavBar.Indicators.click();  
    IndPage.createBasicIndicator();
    TargetsTab.clickTargetsTab();
    TargetsTab.setTargetFrequency('Monthly');
    TargetsTab.setFirstTargetPeriod();
    TargetsTab.setNumTargetPeriods(1);
    TargetsTab.setUnitOfMeasure('Imps per invocation');
    TargetsTab.setLoPTarget(140);
    TargetsTab.setBaseline(141);
    TargetsTab.saveIndicatorChanges();

    let dateRanges = TargetsTab.getTargetDateRanges();
    TargetsTab.addTarget();
    let rangeStart, rangeEnd, dateObj, dateDiff;
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0]);
      rangeStart = DateMath.startOf(dateObj);

      dateObj = new Date(dateRange.split(' - ')[1]);
      rangeEnd = DateMath.startOf(dateObj);

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month');
      expect(1 === dateDiff);
    }

    TargetsTab.saveIndicatorChanges();
    dateRanges = TargetsTab.getTargetDateRanges();
    for (let dateRange of dateRanges) {
      dateObj = new Date(dateRange.split(' - ')[0]);
      rangeStart = DateMath.startOf(dateObj);

      dateObj = new Date(dateRange.split(' - ')[1]);
      rangeEnd = DateMath.startOf(dateObj);

      dateDiff = DateMath.diff(rangeStart, rangeEnd, 'month');
      expect(1 === dateDiff);
    }

    let inputBoxes = TargetsTab.getTargetInputBoxes();
    let targetCount = inputBoxes.length;
    for(let inputBox of inputBoxes) {
      if (inputBox.getValue() == '') {
        inputBox.setValue(1);
      }
    }
    TargetsTab.saveIndicatorChanges();
  });
});

