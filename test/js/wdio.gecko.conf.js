exports.config = {
    execArgv: ['--inspect'],
    specs: [
        './tests/**/*.js'
    ],
    exclude: [
        // 'path/to/excluded/files'
    ],
    suites: {
        login: [
            'tests/00_login.js'
        ],
        dashboard: [
            'tests/dashboard.js'
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
        evidence: [
            'tests/attach_evidence.js',
            'tests/collected_data_form.js',
            'tests/indicator_evidence_dropdown.js',
            'tests/indicator_evidence_table.js'
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
    capabilities: [
    {
        browserName: 'firefox',
        maxInstances: 1,
        args: '[--jsdebugger]',
        'moz:firefoxOptions': {
            //[]
       }
    }],
    sync: true,
    logLevel: 'verbose',
    logOutput: './log',
    coloredLogs: true,
    deprecationWarnings: true,
    bail: 0,
    screenshotPath: './errorShots',
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: [],
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
        require: 'babel-register'
    }
}
