from django.test import TestCase, RequestFactory


class FilterPanelTests(TestCase):
    def setUp(self):
        self.request_factory = RequestFactory()

    def test_filter_by_program(self):
        """It should only selected indicators associated with a given program"""
        self.skipTest('TODO: Test not implemented')

    def test_filter_show_all(self):
        """It should show all indicators for a given project"""
        self.skipTest('TODO: Test not implemented')

    def test_filter_limit_by_number(self):
        """
        It should limit the number of indicators shown by a given positive
        int
        """
        self.skipTest('TODO: Test not implemented')

    def test_filter_by_date(self):
        """It should show only the indicators that fall in a given date range"""
        self.skipTest('TODO: Test not implemented')

    def test_filter_by_level(self):
        """It should show only indicatators of the selected level"""
        self.skipTest('TODO: Test not implemented')

    def test_filter_by_type(self):
        """It should only show indicators of the selected type"""
        self.skipTest('TODO: Test not implemented')

    def test_filter_by_sector(self):
        """It should only show indicators for the selected sector"""
        self.skipTest('TODO: Test not implemented')

    def test_filter_by_site(self):
        """It should only show indicators for the selected site"""
        self.skipTest('TODO: Test not implemented')

    def test_filter_by_indicator(self):
        """It should only show the indicators for the selected indicator"""
        self.skipTest('TODO: Test not implemented')
