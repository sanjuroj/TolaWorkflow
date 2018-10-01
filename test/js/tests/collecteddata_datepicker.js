import IndPage from '../pages/indicators.page'
import TargetsTab from '../pages/targets.page'
import LoginPage from '../pages/login.page'
import Navbar from '../pages/navbar.page'
import Datepicker from '../pages/datepicker'
import Util from '../lib/testutil'
import {expect} from 'chai'

describe("Collected data datepicker", function () {
    // Disable timeouts
    this.timeout(0)

    before(function () {
//        browser.windowHandleMaximize()
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

    describe('using clicked dates', function () {
        it('does not display a date automatically when selected', function () {
            // Open indicators page
            Navbar.Indicators.click()
            Util.waitForAjax()

            // Click the second program in the list
            let progButtons =  TargetsTab.getProgramIndicatorButtons()
            let progButton = progButtons[2]
            progButton.click()
            Util.waitForAjax()

            // Click the first indicator 
            let indicators = browser.$$('span.indicator_name')
            if (indicators.length > 0) {
                indicators[0].click()
            }
            Util.waitForAjax()

            // Click the Add results button
            let addResults = browser.$$('a[href*="/indicators/collecteddata_add/"]')
            let button
            if (addResults.length > 0) {
                button = addResults[0]
            }
            button.click()
            Util.waitForAjax()

            // Find the datepicker and confirm it is blank
            let datepicker = Datepicker
            let curVal = datepicker.getValue()
            Util.dp('curval='+curval)
            expect(val === '')

            // Click into the datepicker and confirm the date remains blank

            // Move to another control
        })

 /*
        it('closes the datepicker window after selecting a date', function() {
            // Open indicators page
            Navbar.Indicators.click()
            Util.waitForAjax()

            // Click the second program in the list
            let progButtons =  TargetsTab.getProgramIndicatorButtons()
            let progButton = progButtons[2]
            progButton.click()
            Util.waitForAjax()

            // Click the first indicator
            let indicators = browser.$$('span.indicator_name')
            if (indicators.length > 0) {
                indicators[0].click()
            }
            Util.waitForAjax()

            // Click the Add results button
            let addResults = browser.$$('a[href*="/indicators/collecteddata_add/"]')
            let button
            if (addResults.length > 0) {
                button = addResults[0]
            }
            button.click()
            //Util.waitForAjax()

            // Find the datepicker and confirm it is blank
            browser.waitForVisible('h2=Results')
            let datepicker = browser.$('input#id_date_collected')
            expect(datepicker.getValue() === '')

            // Click into the datepicker and confirm the date remains blank
            datepicker.click()
            expect(datepicker.getValue() === '')

            // Move to another control
            //let actual = browser.$('input#id_achieved')
            browser.scroll('input#id_achieved')
            expect(datepicker.getValue() === '')
        })

        it('chosen date appears in text box datepicker closes)
        it('assigns given value to correct period if program lifetime includes date (annual)')
        it('assigns given value to correct period if program lifetime includes date (semiannual)')
        it('assigns given value to correct period if program lifetime includes date (triannual)')
        it('assigns given value to correct period if program lifetime includes date (quarterly)')
        it('assigns given value to correct period if program lifetime includes date (monthly)')
        it('displays warning message if given date is outside program lifetime (all target periods)')
        it('does not do the hokey-pokey')
    })

    describe('using keyed-in dates', function () {
        it('closes the datepicker window after entering a date')
        it('chosen date appears in text box datepicker closes)
        it('assigns given value to correct period if program lifetime includes date (annual)')
        it('assigns given value to correct period if program lifetime includes date (semiannual)')
        it('assigns given value to correct period if program lifetime includes date (triannual)')
        it('assigns given value to correct period if program lifetime includes date (quarterly)')
        it('assigns given value to correct period if program lifetime includes date (monthly)')
        it('displays warning message if given date is outside program lifetime (all target periods)')
        it('does not do the hokey-pokey')
*/
    })
})
