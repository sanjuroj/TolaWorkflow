exports.config = {
    execArgv: ['--inspect'],
    specs: [
        './tests/**/*.js'
    ],
    exclude: [
        // './tests/**/busticated_test.js
    ],
    suites: {
        dashboard: [
            'tests/dashboard.js'
        ],
        evidence: [
            'tests/attach_evidence.js',
            'tests/collected_data_form.js',
            'tests/indicator_evidence_dropdown.js',
            'tests/indicator_evidence_table.js'
        ],
        indicators: [
            'tests/annual.js',
            'tests/event.js',
            'tests/lop_only.js',
            'tests/mid-end_line.js',
            'tests/monthly.js',
            'tests/quarterly.js',
            'tests/semiannual.js',
            'tests/triannual.js',
            'tests/create_indicator_form.js',
            'tests/indicator_detail_form.js',
            'tests/indicators_landing_page.js',
            'tests/indicators_table.js'
        ],
        iptt: [
           'tests/iptt_indicator_overview.js',
           'tests/iptt_indicator_overview_report.js',
           'tests/iptt_landing_page.js',
           'tests/iptt_target_overview.js'
        ],

        login: [
            'tests/00_login.js'
        ],
        reports: [
            'tests/export_reports.js',
            'tests/grid_report.js',
            'tests/prog_impact_assessment.js',
            'tests/prog_impact_overview.js'
        ]
    },
    // Capabilities
    maxInstances: 1,
    capabilities: [{
        // maxInstances can get overwritten per capability
        maxInstances: 1,
        browserName: 'chrome'
    },
    {
        maxInstances: 1,
        browserName: 'firefox'
    }],
    // Test Configurations
    sync: true,
    logLevel: 'verbose',
    logOutput: './log',
    coloredLogs: true,
    deprecationWarnings: true,
    bail: 0,
    screenshotPath: './errorShots/',
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: ['selenium-standalone'],
    seleniumLogs: './log',
    framework: 'mocha',
    reporters: ['spec', 'allure'],
    reporterOptions: {
        allure: {
            outputDir: './allure-results'
        }
    },
    mochaOpts: {
        ui: 'bdd',
        compilers: ['js:babel-register'],
        require: ['babel-register']
    }
}
