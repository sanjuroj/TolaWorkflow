/**
 * Page object for the IPTT landing page
 * @module IPTTHome
 **/
import Page from './page';
import Util from '../lib/testutil';
'use strict';

class IpttHome extends Page {
    // IPTT: Program indicator overview
    /**
     * Return the PROGRAM dropdown for the IPTT indicator overview
     * report as a clickable element
     * @returns {athing} A clickable object for the dropdown
     */
    get IndicatorOverviewProgram() {
        return browser.$('select#id_timeperiods-program');
    }
    get IndicatorOverviewProgramList() {
    }
    get IndicatorOverviewTimePeriods() {
        return browser.$('select#id_timeperiods-timeperiods');
    }
    get IndicatorOverviewTimePeriodsList() {
    }
    get IndicatorOverviewTimeFrame() {
        return browser.$('input[name="timeperiods-timeframe"]');
    }
    get IndicatorOverviewNumRecent() {
        return browser.$('input#id_timeperiods-numrecentperiods');
    }
    get IndicatorOverviewViewReport() {
        return browser.$('button#id_submit_timeperiods_button');
    }

    // IPTT: Program target overview quickstart
    get TargetOverviewProgram() {
        return browser.$('select#id_targetperiods-program');
    }
    get TargetOverviewProgramList() {
    }
    get TargetOverviewTargetPeriods() {
        return browser.$('select#id_targetperiods-timeperiods');
    }
    get TargetOverviewTargetPeriodsList() {
    }
    get TargetOverviewTimeFrame() {
        return browser.$('input[name="targetperiods-timeframe"]');
    }
    get TargetOverviewNumRecent() {
        return browser.$('input#id_targetperiods-numrecentperiods');
    }
    get TargetOverviewViewReport() {
        return browser.$('button#id_submit_targetperiods_button');
    }
    get title() {
        browser.waitForVisible('nav.navbar');
        let h4 = browser.$('nav.navbar').$('h4');
        return h4.getText();
    }

    set IndicatorOverviewProgram(val) {
        let elem = browser.$('select[name="timeperiods-program"]');
        elem.click();
        //FIXME: Hard-coded value
        elem.selectByValue(452);
        elem.click();
    }

    set IndicatorOverviewTimeFrame(val) {
        if (val == 'Show all') {
            browser.$('div#div_id_timeperiods-timeframe_0').click();
        } else if (val == 'Most recent') {
            browser.$('div#div_id_timeperiods-timeframe_1').click();
        }
    }

    set IndicatorOverviewTimePeriods(val) {
        let elem = browser.$('select[name="timeperiods-timeperiods"]');
        elem.click();
        elem.selectByVisibleText(val);
        elem.click();
    }

    open() {
        let parms = Util.readConfig();
        super.open(parms.baseurl + 'indicators/iptt_quickstart');
    }
}
export default new IpttHome();
