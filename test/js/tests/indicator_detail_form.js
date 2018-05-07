import IndPage from '../pages/indicators.page';
import LoginPage from '../pages/login.page';
import NavBar from '../pages/navbar.page';
import TargetsTab from '../pages/targets.page';
import Util from '../lib/testutil';
import { expect } from 'chai';

describe('Indicator creation detail form', function() {
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

  //FIXME: Get all of the WebDriver code out of here
  it('should exist', function() {
    NavBar.Indicators.click();
    expect('Program Indicators' === IndPage.getPageName());
    IndPage.createBasicIndicator();
    browser.waitForVisible('h2');
    let title = browser.$('h2').getText().trim();
    expect(true === title.includes('Goal indicator: Temporary'));
  });

  describe('Summary tab', function() {
    it('should exist', function() {
      expect(true === browser.isVisible('=Summary')); 
    });
  }); // end summary tab tests

  describe('Performance tab', function() {
    it('should exist', function() {
      expect(true === browser.isVisible('=Performance')); 
    });
  }); // end performance tab tests

  describe('Targets tab', function() {
    it('should exist', function() {
      expect(true === browser.isVisible('=Targets')); 
    });
  }); // end targets tab tests

  describe('Data Acquisition tab', function() {
    it('should exist', function() {
      expect(true === browser.isVisible('=Data Acquisition')); 
    });
  }); // end data acquistion tab tests

  describe('Analysis and Reporting tab', function() {
    it('should exist', function() {
      expect(true === browser.isVisible('=Analysis and Reporting')); 
    });
  }); // end analysis tab tests

  describe('Approval tab', function() {
    it('should exist', function() {
      expect(true === browser.isVisible('=Approval')); 
    });
  }); // end approval tab tests

  it('should have a Help link', function() {
    expect(true === browser.isVisible('=Help'));
  });

  it('should have a Save Changes button', function() {
    expect(true === browser.isVisible('=Save changes'));
  });

  it('should have a Reset button', function() {
    expect(true === browser.isVisible('=RESET'));
  });

  it('should restore form to pre-edit state when RESET button is clicked', function() {
    let select = browser.$('select#id_sector');
    let options = select.$$('option');
    let option = options[1];
    let origVal = option.getValue();

    // 2 - Basic Needs
    select.selectByValue(2);
    let newVal =  select.getValue();
    expect(2 === newVal);
    IndPage.clickResetButton();
    let resetVal = options[1].getValue();
    expect(origVal === resetVal);
  });
}); // end create indicator detail page tests
