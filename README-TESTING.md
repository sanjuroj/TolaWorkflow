# Unit Testing

Install the _mock_ package if it isn't already installed:

```
pip install mock
```

## Running unit tests
The unit test harness follows the CI and production environments
closely. To run all of the tests (replace _REPO_ with the location
of your TolaActivity tree):

```
cd REPO
python manage.py test
```


You can add module names after the _test_ argument if you're
interested in testing a specific module or modules.

```
python manage.py test indicators
```

## Creating coverage reports
To generate coverage reports locally, you will need to install the
Python _coverage_ module
http://coverage.readthedocs.io/en/coverage-4.5.1/install.html:

```
pip install coverage
```

To generate a coverage report, run your tests thus:

```
coverage run manage.py test
```

Executed in this fashion, tests take slightly longer to run because
_coverage_ is gathering information whilst your code executes. After
the test finishes, run `coverage html` to generate an HTML coverage 
report you can view in your browser:

```
coverage html
```

After running the coverage command you will notice there is a new
directory named _htmlcov_ in the top-level directory. Point your
browser at _htmlcov/index.html_ to view the coverage report. On 
macOS, you can just say `open /path/to/html` and the file will open
in your default browser.
