"""Functional tests for accessing the result forms to create and update results on an indicator

Scenarios:
    - create new result without evidence
    - create new result with evidence
    - update result without evidence -> without evidence
    - update result without evidence -> with evidence
    - update result with evidence -> without evidence
    - update result with evidence -> with evidence
"""

create_url = 'result_add'
udpate_url = 'result_update'