# Getting started with TolaActivity Test Suite (TATS)

This document describes how to set up your system to test TolaActivity
front-end code using _TATS_, the TolaActivity Test Suite. The tools of
choice are:

* [Selenium WebDriver](http://www.seleniumhq.org/) for browser automation
* [Chrome](https://www.google.com/chrome/) and/or
  [Firefox](https://www.mozilla.org/firefox/) browsers
* [WebdriverIO](), a test automation framework for NodeJS that supports
  both synchronous and asynchronous JavaScript
* [Selenium Server](http://www.seleniumhq.org/) for remote browsers
  (think Saucelabs, BrowserStack, or TestBot), a WebdriverIO dependency
* [MochaJS test framework](https://mochajs.org/) with assorted plugins,
  particularly the [ChaiJS assertion library](http://chaijs.com/)
* [Allure](http://allure.qatools.ru/), a test reporter

If you're reading this, you've probably already cloned the repo. If you
haven't, do that, then come back here. Commands listed in this document
assume you're working from the testing directory, _test/js_ in the
TolaActivity repo, unless noted otherwise. If you are impatient, start
with the next section, "The Big Green Button<sup>©</sup>: Quickstart
guide for the impatient".  If you want to understand more about how
to set up and configure TATS works, start with the section, "Manual
installation and testing".

## Runtime configuration files

The framework includes various WebdriverIO, or _WDIO_, runtime
configuration files. They control most of TATS' runtime behavior, such as
which browsers run, which tests to execute, and configure the tests'
runtime environment. The following descriptions summarize each file.

- **wdio.chrome.conf.js** -- Runs all of the tests in the suite against
  the Chrome browser.
- **wdio.gecko.conf.js** -- Runs all of the tests in the suite against
  the Firefox browser.

## The Big Green Button<sup>&copy;</sup>: Quickstart guide for the impatient

![](docs/big_green_button.jpg)

If you have already cloned the repo, the following is the fastest path
to running tests using the fewest keystrokes possible:

```
cd test/js
make realclean
make install
make run-chrome
make run-gecko
```

The following form is identical to the previous one, only slight more concise:

```
cd test/js
make realclean install run-chrome run-gecko
```

- The `realclean` target deletes all generated files, including the
  _node_modules_ directory
- The `install` target, in addition to installing all the necessary
  JavaScript packages, also downloads the Selenium Server and the latest
  known-good versions of the Chrome and Firefox WebDriver clients,
  `chromedriver` and `geckodriver`, respectively
- The `run-chrome` and `run-gecko` targets will start the Selenium server,
  run all of the tests for the indicated browser, and then terminate the
  server after the test completes
- The tests log to _chrome.log_ or _gecko.log_ in the top-level directory
- The server logs to _selenium-server.log_ in the top-level directory
- Additional log output is saved to _log/*_ and screenshots captured when
  errors occur go into _errorShots/_

Skip to the section titled, "Validate the installation".

## Manual installation and testing

**TIP:** Readers will be rewarded for the modest additional effort of
typing `make help` in the top-level test directory, reading the output,
and learning therefrom.

### Clone the repo
```
$ git clone https://github.com/mercycorps.org/TolaActivity.git
$ cd TolaActivity/test/js
```

### Create the user config file
Copy the example user config file to _config.json_ (`cp
config-example.json config.json`) and edit _config.json_, changing
_username_, _password_, and _baseurl_ to suit your needs. In particular:

- _username_ and _password_ must correspond to your MercyCorps SSO login
- _baseurl_ points to the home page of the TolaActivity instance you
  are testing
- **Under no circumstances run the TATS suite against the production
  TolaActivity server. Doing so will create bad data and result in a lot
  of work to remove it, and potentially result in losing known-good,
  live data.**

First, download and install all the bits you'll need. These include
NodeJS, Firefox, Chrome, Selenium, Mocha, and Chai. If you are already
using NPM (and thus already have installed Node), you can use it to
install mocha and chai, but do _not_ use the NPM-packaged Chrome or Firefox
webdrivers because they probably aren't current. Version numbers in the
steps below were current at the time this document was last updated.

1. Install the latest versions of the
   [Chrome](https://www.google.com/chrome/browser) and
   [Firefox](https://www.mozilla.org/download) browsers.
1. Download and install Chrome's Selenium browser driver,
   [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver).
   Place it anywhere in your system $PATH. You may also keep it in
   the testing directory of your local repo because it is gitignored.
   The current version (when this document was last updated) is 2.37.
   **NOTE:** Chromedriver v2.38 does not work with TATS at this time.
   Please stick to 2.37.
1. Download and install Firefox's Selenium browser driver,
   [geckodriver](https://github.com/mozilla/geckodriver/releases).
   Place it anywhere in your system $PATH. You can also keep it in
   the testing directory of your local repo because it is gitignored.
   The current version (as of the last doc update) is 0.20.1.
1. Download [Selenium Server](https://goo.gl/hvDPsK) and place it
   the testing directory. The current version (at the time of writing) is
   3.12.0.
1. Install [NodeJS](https://nodjs.org), if you haven't already, so you
   can use `npm`, the [Node Package Manager](https://www.npmjos.com), to
   install other JavaScript packages, like in the next step for example.
1. Finally, use `npm` to install all of the JavaScript language bindings
   for Selenium, the Mocha test framework, the Chai plugin for Mocha,
   WebDriverIO, and all of the other assorted dependencies and bits:

```
$ npm install
[...]
```

## Validate the Installation
1. Create and modify `config.json` as described previously.
   **Under no circumstances run the TATS suite against the production
   TolaActivity server. Doing so will create bad data and result in a lot
   of work to remove it, and potentially result in losing known-good,
   live data.**
    ```
    $ cd test/js
    $ cp config-example.json config.json
    ```
1. Start the Seleniuim server (targeting the Firefox browser):
    ```
    $ cd test/js
    $ java -jar -Dwebdriver.gecko.driver=./geckodriver selenium-server-standalone-3.11.0.jar &> selenium-server.log &
    ```
1. Execute the test suite:
    ```
    $ cd test/js
    $ ./node_modules/.bin/wdio wdio.gecko.conf.js
    Debugger listening on ws://127.0.0.1:9229/3462dfd8-56a5-41cd-abf6-5f4d2788f8c1
    For help see https://nodejs.org/en/docs/inspector
    ------------------------------------------------------------------
    [firefox #0-0] Session ID: a826ed524be3b055a31d79d79205da16
    [firefox #0-0] Spec: /home/kwall/Work/TolaActivity/test/js/tests/00_login.js
    [firefox #0-0] Running: chrome
1. Rejoice!
    ```
    _output deleted_
    
    ==================================================================
    Number of specs: 30
    
    
    123 passing (515.70s)
    64 skipped
    3 failing
    ```

## Don't want to run everything?
To run the tests in a single file, specify `--spec path/to/file`.
For example, to run only the dashboard tests in auto mode, the command
would be

```
$ ./node_modules/.bin/wdio wdio.auto.conf.js --spec test/specs/dashboard.js
```

You can also use the the `--spec` argument as a crude regex agsinst test
filenames. For example, to run any test that contains _invalid_ in the
filename, this command would do it:

```
$ ./node_modules/.bin/wdio --spec invalid
```

Better still, you can execute a suite of related tests by specifying
`--suite _name_`, where `_name_` is one the names defined in the 
_suites:_ section of the config file. For example, the _evidence suite
is defined in the _wdio.\*.conf.js_ files like so:

```
        evidence: [
           'tests/attach_evidence.js',
           'tests/collected_data_form.js',
           'tests/indicator_evidence_dropdown.js',
           'tests/indicator_evidence_table.js'
        ],

```

Execute it thus:

```
$ ./node_modules/.bin/wdio --suite evidence
```

## Looking for framework documentation?
To produce documentation for the test framework, the API is decorated
with JSDoc decorators, so it will produce JSDoc-compatible documentation
from the code itself. To do so, execute the command `make doc` at the
top of the testing directory:

```
$ make doc
./node_modules/.bin/jsdoc --verbose \
  --package package.json \
  --recurse \
  --destination doc \
  --readme README.md \
  test/lib test/pages -R README.md
Parsing /home/kwall/Work/TolaActivity/test/js/test/lib/testutil.js ...
Parsing /home/kwall/Work/TolaActivity/test/js/test/pages/indicators.page.js ...
Parsing /home/kwall/Work/TolaActivity/test/js/test/pages/login.page.js ...
Generating output files...
Finished running in 0.15 seconds.
```

The resulting output is best viewed in your browser. To do so, open 
file:///path/to/your/repo/doc/index.html in your web browser. It will
end up looking something like the following image. **NOTE:** This is
_API_ documentation; the tests themselves are self-documenting.

![](docs/tola_test_doc_home.png)

## Helpful development practices

If you are a developer, this section is for you. It offers some suggestions
for simple coding proactices that can make the job of testing your GUI code
much, much simpler.

* First and foremost, the single best practice that helps QA testing the
  most is to **use either the _id_ or _name_ attribute on all UI elements
  which require, which _might_ require, or which you are even _thinking_
  about requiring for user interaction.** These attributes make it easier
  to write tests quickly because they have to be unique per-page, so tests
  can rely on being able to access the page elements they need. They also
  make element queries fast, because such lookups are Selenium's happy path.

  [Semantic markup](https://en.wikipedia.org/wiki/Semantic_HTML) is
  arguably more correct, too, but the interest here is to create code
  and tests that are easy to maintain, not demonstrate adherence to
  best practices. Rather, the point is that using _id_ or _name_ reduces
  Selenium's code fragility several orders of magnitude. The people who
  come after us will thank us for using this small bit of semantic markup.

* Similarly, it is helpful for each page to have its own unique
  title. Again, this makes programmatic access to page elements much
  less complicated and reduces verifying that we've loaded the right
  page to a single short, fast expression. This is less impactful
  than using _id_ or _name_ attributes consistently, so if you can
  only do one of these, use _id_ or _name_ attributes consistently.
