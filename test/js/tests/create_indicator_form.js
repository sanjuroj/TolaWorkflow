import IndPage from '../pages/indicators.page';
import LoginPage from '../pages/login.page';
import NavBar from '../pages/navbar.page';
import Util from '../lib/testutil';
import { expect } from 'chai';

describe('Create an Indicator form', function() {
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

  it('should exist', function() {
    NavBar.Indicators.click();
    expect('Program Indicators' === IndPage.getPageName());
    IndPage.clickNewIndicatorButton();
    expect('Create an Indicator' === IndPage.getPageName());
  });

  //FIXME: Get webdriver code out of test
  it('should have an Indicator Service Templates dropdown', function() {
    IndPage.clickIndicatorsLink();
    IndPage.clickNewIndicatorButton();
    let control = $('select#services');
    expect(true === control.isVisible());
    IndPage.saveNewIndicator();
  });

  //FIXME: Get webdriver code out of test
  it('should have a Service Indicator dropdown', function() {
    IndPage.clickIndicatorsLink();
    IndPage.clickNewIndicatorButton();
    let control = $('select#service_indicator');
    expect(true === control.isVisible());
    IndPage.saveNewIndicator();
  });

  //FIXME: Get webdriver code out of test
  it('should have a Country dropdown', function() {
    IndPage.clickIndicatorsLink();
    IndPage.clickNewIndicatorButton();
    let control = $('select#country');
    expect(true === control.isVisible());
    IndPage.saveNewIndicator();
  });

  //FIXME: Get webdriver code out of test
  it('should have a Program dropdown', function() {
    IndPage.clickIndicatorsLink();
    IndPage.clickNewIndicatorButton();
    let control = $('select#program');
    expect(true === control.isVisible());
    IndPage.saveNewIndicator();
  });

  it('should have a save button', function() {
    IndPage.clickIndicatorsLink();
    IndPage.clickNewIndicatorButton();
    let control = $('form[name="most"]').$('input[value="save"]');
    expect(true === control.isVisible());
    control.click();
  });

  it('should confirm indicator created', function() {
    IndPage.clickIndicatorsLink();
    IndPage.clickNewIndicatorButton();
    IndPage.saveNewIndicator();
    let message = IndPage.getAlertMsg();
    expect(message.includes('Success, Basic Indicator Created!'));
  });

  //FIXME: Get webdriver code out of test
  it('should open Indicator detail form after clicking Save button', function() {
    IndPage.clickIndicatorsLink();
    IndPage.clickNewIndicatorButton();
    IndPage.saveNewIndicator();
    let title = browser.$('h2').getText().trim();
    expect(title.includes('Goal indicator: Temporary'));
  });

  //FIXME: Get webdriver code out of test
  it('should have a Reset button to reset form', function() {
    IndPage.clickIndicatorsLink();
    IndPage.clickNewIndicatorButton();
    IndPage.saveNewIndicator();
    let resetBtn = $('form#indicator_update_form').$('input[value="RESET"]');
    expect(true === resetBtn.isVisible());
    resetBtn.click();
  });
});
