import IpttPage from '../pages/iptt.page';
import IndPage from '../pages/indicators.page';
import LoginPage from '../pages/login.page';
import NavBar from '../pages/navbar.page';
import TargetsTab from '../pages/targets.page';
import Util from '../lib/testutil';

/**
 * IPTT report: Program target overview report
 * Tests from mc/issues/119
 */
describe('IPTT report: Program target overview report', function() {
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
   
  it('should only show indicator combos with compatible target periods');
  it('should not show indicator combos with incompatible target periods');
  it('should show indicators with compatible and incompatible target periods in separate tables');
}); 
