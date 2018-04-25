import IpttPage from '../pages/iptt.page';
import LoginPage from '../pages/login.page';
import Util from '../lib/testutil';
import { assert, expect } from 'chai';
'use strict';

/**
 * IPTT report: Program indicator overview
 * Tests from mc/issues/119
 */
describe('Indicator evidence percent indicators', function() {
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
        expect('Program indicator overview' == IpttPage.title);
    });

    it('should have Program dropdown', function() {
        IpttPage.IndicatorOverviewProgram.click();
    });

    it('should have a Time periods dropdown', function() {
        IpttPage.IndicatorOverviewTimePeriods.click();
    });

    it('should allow to select time frame', function() {
        let val = IpttPage.IndicatorOverviewTimeFrame;
        expect(val != undefined);
        expect(val != null);
    });

    it('should default time frame to Show all', function() {
        // 1 == Show all periods
        // 2 == Show N most recent periods
        IpttPage.open();
        let val = IpttPage.IndicatorOverviewTimeFrame;
        expect(val == 1);
    });

    it('should have a View Report button', function() {
        let val = IpttPage.IndicatorOverviewViewReport;
        expect(val != undefined);
        expect(val != null);
        expect('View Report' == val.getText());
    });

    it('should allow to specify N recent time periods', function() {
        //FIXME: magic number
        IpttPage.IndicatorOverviewProgram = 2;
        IpttPage.IndicatorOverviewTimePeriods = 'Years';
        IpttPage.IndicatorOverviewTimeFrame = 'Most recent';
        expect(2 == IpttPage.IndicatorOverviewTimeFrame);
    });

    it('should require choosing a program to create report', function() {
        //FIXME: magic number
        IpttPage.IndicatorOverviewTimePeriods = 'Years';
        expect(IpttPage.IndicatorOverviewViewReport.disabled == 'disabled');
    });

    it('should require select a time period to create report', function() {
        //FIXME: magic number
        IpttPage.IndicatorOverviewProgram = 2;
        IpttPage.IndicatorOverviewTimeFrame = 'Most recent';
        expect(IpttPage.IndicatorOverviewViewReport.disabled == 'disabled');
    });

    it('should create report if all params specified when View Report clicked', function() {
        IpttPage.open();
        //FIXME: magic number
        IpttPage.IndicatorOverviewProgram = 2;
        IpttPage.IndicatorOverviewTimePeriods = 'Years';
        IpttPage.IndicatorOverviewViewReport.click();
        //FIXME: assert/expect something here
        //expect('TBD' == 'PERIOD WILL GO HERE');
    });

    it('should set Start and End date fields based on time period selected');
    it('should allow selecting start and end months');
    it('should allow choosing a relative time span and then modifying the month');
    it('should open report with filter panel(s) open');
    it('should display Targets and % Met fields for LoP target and actual');
    it('should require the start month to be older than the end date');
    it('should only display LoP targets, not intermediate targets');
    it('should only display % Met for LoP targets, not intermediate targets');
}); 
