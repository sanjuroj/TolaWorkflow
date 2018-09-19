.DEFAULT: help

SESRC="http://selenium-release.storage.googleapis.com"
CHROMESRC="https://chromedriver.storage.googleapis.com"
GECKOSRC="https://github.com/mozilla/geckodriver/releases/download"

# Server version
SEURL=$(SESRC)/3.14/selenium-server-standalone-3.14.0.jar
SESERVER=$(shell basename $(SEURL))

# Figure out which browser drivers we want
ifeq ($(XDG_SESSION_TYPE),x11)
# Linux
	CHROMEURL=$(CHROMESRC)/2.42/chromedriver_linux64.zip
	GECKOURL=$(GECKOSRC)/v0.22.0/geckodriver-v0.22.0-linux64.tar.gz
else
# Mac
	CHROMEURL=$(CHROMESRC)/2.37/chromedriver_mac64.zip
	GECKOURL=$(GECKOSRC)/v0.22.0/geckodriver-v0.22.0-macos.tar.gz
endif
CHROMEDRIVER=$(shell basename $(CHROMEURL))
GECKODRIVER=$(shell basename $(GECKOURL))

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
	$(RM) -vfr doc errorShots log *server.log

doc:
	./node_modules/.bin/jsdoc --verbose \
		--package package.json \
		--recurse \
		--destination doc \
		--readme README.md \
		./lib ./pages -R README.md

install:
	npm install --verbose --save-dev
	@echo "Downloading Selenium server..."
	curl --location -O $(SEURL)
	@echo "Downloading Chrome's chromedriver webdriver client..."
	curl --location -O $(CHROMEURL)
	unzip -o -d . $(CHROMEDRIVER)
	@echo "Downloading Firefox's geckodriver webdriver client..."
	curl --location -O $(GECKOURL)
	tar xzvf $(GECKODRIVER)

realclean: clean
	rm -fvr node_modules chromedriver geckodriver $(CHROMEDRIVER) $(GECKODRIVER) $(SESERVER)

run-chrome:
	java -jar -Dwebdriver.chrome.driver=chromedriver $(SESERVER) | tee server.log 2>&1 &
	npm run wdio wdio.chrome.conf | tee chrome.log 2>&1
	-killall -qw java

run-gecko:
	java -jar -Dwebdriver.gecko.driver=geckodriver $(SESERVER) | tee server.log 2>&1 &
	npm run wdio wdio.gecko.conf | tee gecko.log 2>&1
	-killall -qw java

update:
	npm update --verbose --save --dev
