"""Tests of the IPTT Refactor including unit tests and functional tests

Unit:
    IPTT QuickstartJSContext
        - given one/more program, jscontext includes:
            - name
            - frequencies (in correct language)

"""

from indicators.tests.iptt_tests.quickstart_unit import (
    TestIPTTQuickstartJSContext
)

from indicators.tests.iptt_tests.reportview_unit import (
    TestIPTTReportviewURL
)

from indicators.tests.iptt_tests.targetperiod_lop_values import (
    TestIPTTReportResponseCounts
)