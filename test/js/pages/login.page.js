/**
 * Page model and methods for dealing with the MercyCorps
 * SSO login page
 * @module LoginPage
 */
import Page from './page';
const delay = 1000; // milliseconds
'use strict';

class LoginPage extends Page {
    // These are for authentication using MC's SSO
    get username() { return $('#login'); }
    get password() { return $('#password'); }
    get login() { return $('.inputsub'); }
    get error() { return browser.getText('#error'); }

    set username(val) { return $('#login').setValue(val); }
    set password(val) { return $('#password').setValue(val); }

    // These are for authenticating using GoogleAuth on a local instance
    get gUsername() { return $('form').$('input#identifierId'); }
    get gPassword() { return $('form').$('input.whsOnd.zHQkBf'); }
    get googleplus() { return $('=Google+'); }
    get gError() { return $('div.dEOOab.RxsGPe').getText(); }

    set gUsername(val) {
        browser.waitForVisible('input#identifierId');
        // Works on chrome and firefox
        browser.$('form').$('input#identifierId').setValue(val);
        browser.waitForVisible('div#identifierNext');
        browser.$('div#identifierNext').click();
        browser.pause(delay);
    }
    set gPassword(val) {
        browser.waitForVisible('input[name="password"]');
        // Works on chrome and firefox
        browser.$('input[name="password"]').setValue(val);
        browser.pause(delay);
        browser.waitForVisible('div#passwordNext');
        browser.$('div#passwordNext').click();
        browser.pause(delay);
        browser.waitUntil(function() {
            let url = browser.getUrl();
            if (url.includes('mercycorps') || url.includes('localhost')) {
                return url;
            }
        });
        //browser.waitForText('h4');
    }

    // Works everywhere (or at least it better)
    get title() { return browser.getTitle(); }

    open(url) { super.open(url); }
}
export default new LoginPage();
