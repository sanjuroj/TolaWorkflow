import IpttPage from '../pages/iptt.page';
import LoginPage from '../pages/login.page';
import Util from '../lib/testutil';
import { expect } from 'chai';

/**
 * IPTT report: Program indicator overview quickstart
 * Tests from mc/issues/119
 */
describe('IPTT: Program indicator overview quickstart', function() {
  before(function() {
    // Disable timeouts
    this.timeout(0);
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

  it('should exist', function () {
    IpttPage.open();
    expect('Indicator Performance Tracking Table' === IpttPage.title);
    expect('Program indicator overview' === IpttPage.quickstart('indicator'));
  });

  it('should have Program dropdown', function() {
    IpttPage.IndicatorOverviewProgram.click();
  });

  it('should have a Time periods dropdown', function() {
    IpttPage.IndicatorOverviewTimePeriods.click();
  });

  it('should allow to select time frame', function() {
    let val = IpttPage.IndicatorOverviewTimeFrame;
    expect(undefined !== val);
    expect(null !== val);
  });

  it('should default time frame to Show all', function() {
    // 1 === Show all periods
    // 2 === Show N most recent periods
    IpttPage.open();
    let val = IpttPage.IndicatorOverviewTimeFrame;
    //FIXME: magic number
    expect(1 === val);
  });

  it('should have a View Report button', function() {
    let elem = IpttPage.IndicatorOverviewViewReport;
    expect(undefined !== elem);
    expect(null !== elem);
    expect('View Report' === elem.getText());
  });

  it('should allow to specify N recent time periods', function() {
    //FIXME: magic number
    IpttPage.IndicatorOverviewProgram = 2;
    IpttPage.IndicatorOverviewTimePeriods = 'Years';
    IpttPage.IndicatorOverviewTimeFrame = 'Most recent';
    expect(2 === IpttPage.IndicatorOverviewTimeFrame);
  });

  it('should require choosing a program to create report', function() {
    // Select a time period but not program
    IpttPage.IndicatorOverviewTimePeriods = 'Years';
    expect('disabled' === IpttPage.IndicatorOverviewViewReport.disabled);
  });

  it('should require select a time period to create report', function() {
    // Select a program, but not a time period
    //FIXME: magic number
    IpttPage.IndicatorOverviewProgram = 2;
    IpttPage.IndicatorOverviewTimeFrame = 'Most recent';
    expect('disabled' === IpttPage.IndicatorOverviewViewReport.disabled);
  });

  it('should create report if all params specified correctly', function() {
    IpttPage.open();
    //FIXME: magic number
    IpttPage.IndicatorOverviewProgram = 2;
    IpttPage.IndicatorOverviewTimePeriods = 'Years';
    IpttPage.IndicatorOverviewViewReport.click();
    // If the table isn't there, we didn't make a report
    expect(true === browser.isVisible('table#iptt_table'));
  });

  it('should open report with filter panel open', function () {
    expect(true === browser.isVisible('form#id_form_indicator_filter'));
  });
}); 
