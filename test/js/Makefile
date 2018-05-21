.DEFAULT: help
SESERVER='http://selenium-release.storage.googleapis.com/3.12/selenium-server-standalone-3.12.0.jar'
# Linux
CHROMEDRIVER='https://chromedriver.storage.googleapis.com/2.37/chromedriver_linux64.zip'
GECKODRIVER='https://github.com/mozilla/geckodriver/releases/download/v0.20.1/geckodriver-v0.20.1-linux64.tar.gz'
# Mac
#CHROMEDRIVER='https://chromedriver.storage.googleapis.com/2.37/chromedriver_mac64.zip'
#GECKODRIVER='https://github.com/mozilla/geckodriver/releases/download/v0.20.1/geckodriver-v0.20.1-macos.tar.gz'

help:
	@echo "clean       : remove all logs, generated files, and test results"
	@echo "doc         : (re)generate test suite documentation"
	@echo "help        : show this help message"
	@echo "install     : install all the bits needed to run tests"
	@echo "realclean   : remove all logs, generated files, test results, and node_modules"
	@echo "run-chrome  : run all the tests against Chrome"
	@echo "run-gecko   : run all the tests against Firefox"
	@echo "update      : refresh packages in top-level package.json file"

clean:
	@rm -vfr doc errorShots log *server.log

doc:
	@./node_modules/.bin/jsdoc --verbose \
		--package package.json \
		--recurse \
		--destination doc \
		--readme README.md \
		./lib ./pages -R README.md

install:
	@npm install --verbose --save-dev
	@echo "Downloading Selenium server..."
	@curl --location  -O $(SESERVER)
	@echo "Downloading Chrome chromedriver webdriver client..."
	@curl --location  -O $(CHROMEDRIVER)
	@unzip -o -d . $(shell basename $(CHROMEDRIVER))
	@echo "Downloading Firefox geckodriver webdriver client..."
	@curl --location  -O $(GECKODRIVER)
	@tar xzvf $(shell basename $(GECKODRIVER))

realclean: clean
	@rm -fvr node_modules $(CHROMEDRIVER) $(GECKODRIVER) $(SESERVER) \
    $(shell basename $(CHROMEDRIVER)) \
    $(shell basename $(GECKODRIVER)) \
    $(shell basename $(SESERVER))

run-chrome:
	-killall -q java
	@java -jar -Dwebdriver.chrome.driver=chromedriver $(shell basename $(SESERVER)) | tee server.log 2>&1 &
	@npm run wdio wdio.chrome.conf | tee chrome.log 2>&1
	-killall -q java

run-gecko:
	-killall -q java
	@java -jar -Dwebdriver.gecko.driver=geckodriver $(shell basename $(SESERVER)) | tee server.log 2>&1 &
	@npm run wdio wdio.gecko.conf | tee gecko.log 2>&1
	-killall -q java

update:
	@npm update --verbose --save --dev
