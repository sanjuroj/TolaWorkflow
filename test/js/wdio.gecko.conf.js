exports.config = {
  // execArgv: ['--inspect'],
  specs: [
    './tests/**/*.js'
  ],
  exclude: [
    // 'path/to/excluded/files'
  ],
  suites: {
    dashboard: [
      'tests/dashboard.js'
    ],
    evidence: [
      'tests/collected_data_form.js',
      'tests/indicator_evidence_dropdown.js'
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
      'tests/iptt_indicator_overview_report.js',
      'tests/iptt_indicator_overview.js',
      'tests/iptt_landing_page.js',
      'tests/iptt_target_overview_report.js',
      'tests/iptt_target_overview.js'
    ],
    login: [
      'tests/00_login.js'
    ],
    reports: [
      'tests/grid_report.js'
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
      // []
      }
    }
  ],
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
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    require: 'babel-register'
  }
}
