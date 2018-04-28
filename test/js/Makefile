.DEFAULT: help

help:
	@echo "clean     : remove all logs, generated files, and test results"
	@echo "doc       : (re)generate test suite documentation"
	@echo "help      : show this help message"
	@echo "install   : install all the bits needed to run tests"
	@echo "realclean : remove all logs, generated files, test results, and node_modules"
	@echo "update    : refresh packages in top-level package.json file"

clean:
	@rm -fvr allure-* doc errorShots log *server.log

doc:
	@./node_modules/.bin/jsdoc --verbose \
		--package package.json \
		--recurse \
		--destination doc \
		--readme README.md \
		./lib ./pages -R README.md

install:
	@npm install --verbose --save-dev

realclean: clean
	@rm -fvr node_modules

update:
	@npm update --verbose --save-dev --save --dev
