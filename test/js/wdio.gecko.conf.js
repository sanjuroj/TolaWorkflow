exports.config = {
  //execArgv: ['--inspect'],
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
      'tests/evidence_table_num_ind.js',
      'tests/evidence_table_pct_ind.js',
      'tests/indicator_evidence_dropdown.js'
    ],
    indicators: [
      'tests/indicators_landing_page.js',
      'tests/indicators_table.js',
      'tests/create_indicator_form.js',
      'tests/indicator_detail_form.js',
      'tests/num_ind_config_display.js',
      'tests/num_pct_ind.js'
    ],
    iptt: [
      'tests/iptt_landing_page.js',
      'tests/iptt_indicator_overview.js',
      'tests/iptt_target_overview.js',
      'tests/iptt_indicator_overview_report.js',
      'tests/iptt_target_overview_report.js',
      'tests/report_filter_panel.js',
      'tests/report_sort_columns.js'
    ],
    login: [
      'tests/00_login.js'
    ],
    periodic: [
      'tests/event.js',
      'tests/lop_only.js',
      'tests/mid-end_line.js',
      'tests/semiannual.js',
      'tests/triannual.js',
      'tests/monthly.js',
      'tests/quarterly.js',
      'tests/periodic_date_ranges.js'
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
