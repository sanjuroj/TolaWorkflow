import LoginPage from '../pages/login.page';
import Util from '../lib/testutil';
import { expect } from 'chai';

describe('TolaActivity Login screen', function() {
    before(function() {
        this.timeout(0);
        browser.windowHandleMaximize();
    });

    it('should deny access if username is invalid', function() {
        let parms = Util.readConfig();
        // inject bogus username
        parms.username = 'HorseWithNoName';

        LoginPage.open(parms.baseurl); 
        if (parms.baseurl.includes('mercycorps.org')) {
            LoginPage.username = parms.username;
            LoginPage.password = parms.password;
            LoginPage.login.click();
            expect(LoginPage.error).to.include('Login failed:');
        }
        if (parms.baseurl.includes('localhost') && 'Login' == LoginPage.title) {
            LoginPage.googleplus.click();
            if ('TolaActivity' != LoginPage.title) {
                LoginPage.gUsername = parms.username + '@mercycorps.org';
                expect(LoginPage.gError).
                    to.include("Couldn't find your Google Account");
            }
        }
    });

    it('should deny access if password is invalid', function() {
        let parms = Util.readConfig();
        // Inject bogus password
        parms.password = 'ThisBetterFail';

        LoginPage.open(parms.baseurl);
        if (parms.baseurl.includes('mercycorps.org')) {
            LoginPage.username = parms.username;
            LoginPage.password = parms.password;
            LoginPage.login.click();
            expect(LoginPage.error).to.include('Login failed:');
        }
        if (parms.baseurl.includes('localhost') && 'Login' == LoginPage.title) {
            LoginPage.googleplus.click();
            if ('TolaActivity' != LoginPage.title) {
                LoginPage.gUsername = parms.username + '@mercycorps.org';
                LoginPage.gPassword = parms.password;
                expect(LoginPage.gError).to.include('Wrong password.');
            }
         }
    });

    it('should require unauthenticated user to authenticate', function() {
        let parms = Util.readConfig();

        LoginPage.open(parms.baseurl);
        if (parms.baseurl.includes('mercycorps.org')) {
            LoginPage.username = parms.username;
            LoginPage.password = parms.password;
            LoginPage.login.click();
        }
        if (parms.baseurl.includes('localhost') && 'Login' == LoginPage.title) {
            if ('TolaActivity' != LoginPage.title) {
                LoginPage.googleplus.click();
                LoginPage.gUsername = parms.username + '@mercycorps.org';
                LoginPage.gPassword = parms.password;
                expect(LoginPage.title).to.equal('TolaActivity');
            }
        }
    });
});
