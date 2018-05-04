/**
 * Page object for the IPTT landing page
 * @module IpttPage
 **/
import Page from './page';
import Util from '../lib/testutil';

class IpttPage extends Page {

    get title() {
        browser.waitForVisible('nav.navbar');
        let h2 = browser.$('h2.mt-2.mb-3.mx-3');
        return h2.getText();
    }

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


    // IPTT: Program target overview quickstart
    get TargetOverviewProgram() {
        return browser.$('select#id_targetperiods-program');
    }

    get TargetOverviewProgramList() { }

    get TargetOverviewTargetPeriods() {
        return browser.$('select#id_targetperiods-targetperiods');
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

    set TargetOverviewProgram(val) {
        let elem = browser.$('select[name="targetperiods-program"]');
        elem.click();
        //FIXME: Hard-coded value
        elem.selectByValue(452);
        elem.click();
    }

    set TargetOverviewTimeFrame(val) {
        if (val == 'Show all') {
            browser.$('div#div_id_targetperiods-timeframe_0').click();
        } else if (val == 'Most recent') {
            browser.$('div#div_id_targetperiods-timeframe_1').click();
        }
    }

    set TargetOverviewTargetPeriods(val) {
        let elem = browser.$('select[name="targetperiods-targetperiods"]');
        elem.click();
        elem.selectByVisibleText(val);
        elem.click();
    }

    open() {
        let parms = Util.readConfig();
        super.open(parms.baseurl + 'indicators/iptt_quickstart');
    }

    quickstart(source) {
        browser.waitForVisible('div#id_div_top_quickstart_iptt');
        let cards = browser.$$('div.card');
        if (source == 'indicator') {
            return cards[0].$('h5').getText();
        } else if (source == 'target') {
            return cards[1].$('h5').getText();
        }
    }
}
export default new IpttPage();
