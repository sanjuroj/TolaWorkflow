from django.test import TestCase, Client


class ReportsTestCase(TestCase):

    def setUp(self):
        self.client = Client()

    def test_report_home_page_returns_200(self):
        '''Does "/report/"  return 200'''
        response = self.client.get('/report/', follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.redirect_chain), 1)

    def test_report_home_page_uses_correct_template(self):
        response = self.client.get('/report/', follow=True)
        self.assertTemplateUsed('reports/report_home.html')

    def test_report_data_project_page_returns_200(self):
        '''Does "/report_data/project/" return 200?'''
        response = self.client.get('/report_data/project/', follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.redirect_chain), 0)

    def test_report_data_project_page_uses_correct_template(self):
        response = self.client.get('/report_data/project/', follow=True)
        self.assertTemplateUsed('reports/project_report_data.html')

    def test_report_data_indicator_page_returns_200(self):
        '''Does "/report_data/indicator/" return 200'''
        response = self.client.get('/report_data/indicator/', follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.redirect_chain), 0)
        pass

    def test_report_data_indicator_page_uses_correct_template(self):
        response = self.client.get('/report_data/indicator/', follow=True)
        self.assertTemplateUsed('reports/indicator_report_data.html')

    def test_report_data_collecteddata_page_returns_200(self):
        '''Does "/report_data/collecteddata" return 200?'''
        response = self.client.get('/report_data/collecteddata/', follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.redirect_chain), 0)
        pass

    def test_report_data_collecteddata_uses_correct_template(self):
        response = self.client.get('/report_data/collecteddata/', follow=True)
        self.assertTemplateUsed('report/collecteddata_report_data.html')

    def test_report_data_home_page_returns_200(self):
        '''Does "/report_data/" return 200?'''
        response = self.client.get('/report_data/', follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.redirect_chain), 1)

    def test_report_data_home_page_uses_correct_template(self):
        response = self.client.get('/report_data/', follow=True)
        self.assertTemplateUsed('reports/report_data.html')
