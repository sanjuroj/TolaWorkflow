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
        expect(NavBar.TolaActivity !== null);
        expect(NavBar.TolaActivity !== undefined);
        NavBar.TolaActivity.click();
    });

    it('should have a Workflow dropdown', function() {
        expect(NavBar.Workflow !== null);
        expect(NavBar.Workflow !== undefined);
        NavBar.Workflow.click();
    });

    it('should have a Country Dashboard dropdown', function() {
        DashboardPage.CountryDashboardDropdown.click();
    });

    it('should have a Filter by Program link', function() {
        DashboardPage.FilterByProgramDropdown.click();
    });

    it('should have a Reports dropdown', function() {
        expect(NavBar.Reports !== null);
        expect(NavBar.Reports !== undefined);
        NavBar.Reports.click();
    });

    it('should have a Profile link', function() {
        expect(NavBar.UserProfile !== null);
        expect(NavBar.UserProfile !== undefined);
        NavBar.UserProfile.click();
    });

    it('should have a Sites panel', function() {
        expect(DashboardPage.SitesPanel !== null);
        expect(DashboardPage.SitesPanel !== undefined);
        expect('Sites' === DashboardPage.SitesPanel.getText());
    });

    it('should show map of country sites', function() {
        expect(DashboardPage.SitesMap !== null);
        expect(DashboardPage.SitesMap !== undefined);
    });

    it('should have a Program Projects by Status panel', function() {
        expect(DashboardPage.ProgramProjectsByStatusPanel !== null);
        expect(DashboardPage.ProgramProjectsByStatusPanel !== undefined);
    });

    it('should have a project status chart', function() {
        expect(DashboardPage.ProgramProjectsByStatusChart !== null);
        expect(DashboardPage.ProgramProjectsByStatusChart !== undefined);
    });

    it('should have a KPI Targets vs Actuals panel', function() {
        expect(DashboardPage.KpiTargetsVsActualsPanel !== null);
        expect(DashboardPage.KpiTargetsVsActualsPanel !== undefined);
    });

    it('should have a KPI Targets vs Actuals chart', function() {
        expect(DashboardPage.KpiTargetsVsActualsChart !== null);
        expect(DashboardPage.KpiTargetsVsActualsChart !== undefined);
    });

    // Enhancements?
    it('should be able to zoom in on the map');
    it('should be able to zoom out on the map');
    it('should display data points on the Sites map');
});
