module.exports = {
  baseURL: 'https://selenium-release.storage.googleapis.com',
  version: '3.12.0',
  drivers: {
    chrome: {
      version: '2.37',
      arch: process.arch,
      baseURL: 'https://chromedriver.storage.googleapis.com'
  },
    firefox: {
      version: '0.20.1',
      arch: process.arch,
      baseURL: 'https://github.com/mozilla/geckodriver/releases/download'
  },
}

