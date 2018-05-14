import IndPage from '../pages/indicators.page';
import LoginPage from '../pages/login.page';
import NavBar from '../pages/navbar.page';
import TargetsTab from '../pages/targets.page';
import Util from '../lib/testutil';
import { expect } from 'chai';

describe('"Annual" target frequency', function() {
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

  it('should require date that first target period begins', function() {
  NavBar.Indicators.click();
  expect('Program Indicators' === IndPage.getPageName());
  IndPage.createBasicIndicator();

  TargetsTab.setIndicatorName('Annual target, first period required');
  TargetsTab.setUnitOfMeasure('Hawks per hectare');
  TargetsTab.setLoPTarget(271);
  TargetsTab.setBaseline(272);
  TargetsTab.setTargetFrequency('Annual');

  // Trying to save without setting the start date should fail
  TargetsTab.saveIndicatorChanges();
  let errorMessage = TargetsTab.getTargetFirstPeriodErrorHint();
  expect(errorMessage.includes('Please complete this field.'));
  });

  it('should default number of periods to 1', function() {
  expect(1 === TargetsTab.getNumTargetPeriods());
  });

  it('should create target periods for each period requested', function() {
  NavBar.Indicators.click();
  IndPage.createBasicIndicator();

  TargetsTab.setIndicatorName('Annual target, create target periods');
  TargetsTab.setUnitOfMeasure('Inkblots per Injunction');
  TargetsTab.setLoPTarget(293);
  TargetsTab.setBaseline(294);
  TargetsTab.setTargetFrequency('Annual');
  TargetsTab.setNumTargetPeriods(2);

  // This should succeed
  TargetsTab.saveIndicatorChanges();
  expect(2 === TargetsTab.getNumTargetPeriods());
  });

  it('should require entering targets for each target period', function() {
  NavBar.Indicators.click();
  IndPage.createBasicIndicator();

  TargetsTab.setIndicatorName('Annual target, target period value(s) required');
  TargetsTab.setUnitOfMeasure('Inedibles per iguana');
  TargetsTab.setLoPTarget(308);
  TargetsTab.setBaseline(309);
  TargetsTab.setTargetFrequency('Annual');
  TargetsTab.setNumTargetPeriods(2);
  TargetsTab.setFirstTargetPeriod();
  TargetsTab.saveIndicatorChanges();

  // Find the input boxes
  let inputBoxes = TargetsTab.getTargetInputBoxes();
  let targetCount = inputBoxes.length;
  // Place values in each box one at a time and attempt to save.
  // This should *fail* until all the fields are filled.
  let errorCount = 0;
  let errMsg;
  for(let inputBox of inputBoxes) {
    inputBox.setValue(86);
    TargetsTab.saveIndicatorChanges();
    // Did we fail successfully?
    errMsg = TargetsTab.getTargetValueErrorHint();
    expect(errMsg.includes('Please enter a target value.'));
    errorCount++;
  }
  expect(targetCount === errorCount);
  });
});
