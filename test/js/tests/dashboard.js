import DashboardPage from '../pages/dashboard.page';
import LoginPage from '../pages/login.page';
import NavBar from '../pages/navbar.page';
import Util from '../lib/testutil';
import { expect } from 'chai';

describe('TolaActivity Dashboard', function() {
    before(function() {
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
            if ('TolaActivity' !== LoginPage.title) {
                LoginPage.gUsername = parms.username + '@mercycorps.org';
                LoginPage.gPassword = parms.password;
            }
        }
    });

    it('should have a page header', function() {
        expect('Tola-Activity Dashboard' === DashboardPage.title);
    });

    it('should have a TolaActivity link', function() {
        expect(null !== NavBar.TolaActivity);
        expect(undefined !== NavBar.TolaActivity);
        NavBar.TolaActivity.click();
    });

    it('should have a Workflow dropdown', function() {
        expect(null !== NavBar.Workflow);
        expect(undefined !== NavBar.Workflow);
        NavBar.Workflow.click();
    });

    it('should have a Country Dashboard dropdown', function() {
        DashboardPage.CountryDashboardDropdown.click();
    });

    it('should have a Filter by Program link', function() {
        DashboardPage.FilterByProgramDropdown.click();
    });

    it('should have a Reports dropdown', function() {
        expect(null !== NavBar.Reports);
        expect(undefined !== NavBar.Reports);
        NavBar.Reports.click();
    });

    it('should have a Profile link', function() {
        expect(null !== NavBar.UserProfile);
        expect(undefined !== NavBar.UserProfile);
        NavBar.UserProfile.click();
    });

    it('should have a Sites panel', function() {
        expect(null !== DashboardPage.SitesPanel);
        expect(undefined !== DashboardPage.SitesPanel);
        expect('Sites' == DashboardPage.SitesPanel.getText());
    });

    it('should show map of country sites', function() {
        expect(null !== DashboardPage.SitesMap);
        expect(undefined !== DashboardPage.SitesMap);
    });

    it('should have a Program Projects by Status panel', function() {
        expect(null !== DashboardPage.ProgramProjectsByStatusPanel);
        expect(undefined !== DashboardPage.ProgramProjectsByStatusPanel);
    });

    it('should have a project status chart', function() {
        expect(null !== DashboardPage.ProgramProjectsByStatusChart);
        expect(undefined !== DashboardPage.ProgramProjectsByStatusChart);
    });

    it('should have a KPI Targets vs Actuals panel', function() {
        expect(null !== DashboardPage.KpiTargetsVsActualsPanel);
        expect(undefined !== DashboardPage.KpiTargetsVsActualsPanel);
    });

    it('should have a KPI Targets vs Actuals chart', function() {
        expect(null !== DashboardPage.KpiTargetsVsActualsChart);
        expect(undefined !== DashboardPage.KpiTargetsVsActualsChart);
    });

    // Enhancements?
    it('should be able to zoom in on the map');
    it('should be able to zoom out on the map');
    it('should display data points on the Sites map');
});
