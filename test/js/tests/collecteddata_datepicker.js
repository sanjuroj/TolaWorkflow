import IndPage from '../pages/indicators.page'
import TargetsTab from '../pages/targets.page'
import LoginPage from '../pages/login.page'
import Navbar from '../pages/navbar.page'
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

    describe('using typed-in dates', function () {
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
            let addResults = $$('a[href*="/indicators/collecteddata_add/"]')
            let button
            if (addResults.length > 0) {
                button = addResults[0]
            }
            button.click()
            Util.waitForAjax()

            // Find the datepicker and confirm it is blank
            //browser.waitForVisible('h2=Results')
            //let datepicker = $('input#id_date_collected')
            //expect(datepicker.getText() == '')

            // Click into the datepicker and confirm the date remains blank

            // Select a date

            // Confirm the date that goes into the text box
        })

/*
        it('closes the datpicker window after selecting a date')
        it('assigns given value to correct period if program lifetime includes date (annual)')
        it('assigns given value to correct period if program lifetime includes date (semiannual)')
        it('assigns given value to correct period if program lifetime includes date (triannual)')
        it('assigns given value to correct period if program lifetime includes date (quarterly)')
        it('assigns given value to correct period if program lifetime includes date (monthly)')
        it('displays warning message if given date is outside program lifetime (all target periods)')
        it('does not do the hokey-pokey')
    })

    describe('using clicked dates', function () {
        it('does not display a date automatically when selected')
        it('closes the datpicker window after selecting a date')
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
