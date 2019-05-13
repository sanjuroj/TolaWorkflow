"""Tests of the IPTT Refactor including unit tests and functional tests

Unit:
    IPTT QuickstartJSContext
        - given one/more program, jscontext includes:
            - name
            - frequencies (in correct language)

"""
# 
# from indicators.tests.iptt_tests.tp_indicator_counts import (
#     TestIPTTTimeperiodsValues
# )
# 
# 
# from indicators.tests.iptt_tests.quickstart_unit import (
#     TestIPTTQuickstartJSContext
# )
# 
# from indicators.tests.iptt_tests.reportview_unit import (
#     TestIPTTReportviewURL
# )
# 
# from indicators.tests.iptt_tests.tva_indicator_counts import (
#     TestIPTTReportResponseCountsLOP,
#     TestIPTTReportResponseCountsMidEnd,
#     TestIPTTReportResponseCountsAnnual,
#     TestIPTTReportResponseCountsMonthly
# )
# 
# from indicators.tests.iptt_tests.tva_indicator_lop_values import (
#     TestSingleLOPNumNCIndicatorIPTTResponse,
#     TestSingleMidendNumNCIndicatorIPTTResponse,
#     TestSingleSemiAnnualNumNCIndicatorIPTTResponse,
#     TestSingleQuarterlyNumNCIndicatorIPTTResponse,
#     TestSingleLOPNumCumIndicatorIPTTResponse,
#     TestSingleLOPPercentIndicatorIPTTResponse,
#     TestSingleMidEndPercentIndicatorIPTTResponse,
#     TestSingleTriannualPercentIndicatorIPTTResponse,
#     TestMultipleLOPIndicatorsIPTTResponse,
#     TestMultipleQuarterlyIndicatorsIPTTResponse,
#     TestMultipleCumulativeIndicatorsIPTTResponse,
#     TestMultiplePercentLOPIndicatorsIPTTResponse,
#     TestMultiplePercentAnnualIndicatorsIPTTResponse
# )
# 
# from indicators.tests.iptt_tests.tva_report_tests import (
#     TestMidEndTVAReportValues,
#     TestSemiannualTVAReportValues
# )

from indicators.tests.iptt_tests.iptt_api_tests import (
    TestLevelAPIData
)

#  needs to be overhauled to not use outdate methods
# from indicators.tests.iptt_tests.iptt_reports_i18n import (
#     TestIPTTTimePeriodReportsI18N,
#     TestIPTTTargetReportsI18N
# )