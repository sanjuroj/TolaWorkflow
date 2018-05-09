import IpttPage from '../pages/iptt.page';
import LoginPage from '../pages/login.page';
import Util from '../lib/testutil';
import { expect } from 'chai';

/**
 * IPTT report: Program indicator overview report
 * Tests from mc/issues/119
 */
describe('Program indicator overview report', function() {
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

  it('should only display LoP targets, not intermediate targets');
  it('should only display % Met for LoP targets, not intermediate targets');
}); 
