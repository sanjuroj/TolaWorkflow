
The files in this directory contain utilities that may help in tests related to programs, indicators and results.  The main components of these utilities are scenarios, utility scripts for creating database objects based on minimal parameters, and mixin base classes for running the same tests across multiple configurations of data (e.g. calculation of the LOP actual for cumulative indicators is different than for non-cumulative indicators).

The steps for adding a new test are as follows:
1. Identify or create a scenario with the appropriate configured flags and values
2. Ensure the appropriate calculation methods exist in the IndicatorValues class
3. Add the test method to the mixin class (e.g. ScenarioBase)
4. Add a test class to the app level test file that inherits from the mixin class and TestCase.
