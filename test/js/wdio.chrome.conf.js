exports.config = {
  //execArgv: ['--inspect'],
  specs: [
    './tests/**/*.js'
  ],
  exclude: [
    // './tests/**/busticated_test.js'
  ],
  // Capabilities
  maxInstances: 2,
  capabilities: [{
    // maxInstances can get overwritten per capability
    browserName: 'chrome',
    maxInstances: 1
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
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    require: 'babel-register',
    retries: 3
  }
}
