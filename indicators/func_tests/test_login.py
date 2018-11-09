import time
import unittest

from django.test import tag
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as expect
from selenium.webdriver.support.wait import WebDriverWait

# from tola.settings import local

@tag('functional')
class TolaLoginTestCase(unittest.TestCase):
    def setUp(self):
        # self.username = local.app_settings['TOLAUSER']
        # self.password = local.app_settings['TOLAPASS']
        self.browser = webdriver.Firefox()

    def tearDown(self):
        self.browser.quit()
    
    def test_valid_user_can_login(self):
        browser = self.browser
        browser.get('http://localhost:8000/')
        self.assertIn('LoginTolaActivity', browser.title)

        # Localhost uses Google auth services
        browser.find_element_by_link_text('Google+').click()

        username = WebDriverWait(browser, 2).until(
            expect.presence_of_element_located((By.ID, 'identifierId'))
        )
        username.send_keys(self.username)

        next = WebDriverWait(browser, 2).until(
            expect.presence_of_element_located((By.ID, 'identifierNext'))
        )
        next.click()

        passwd = WebDriverWait(browser, 2).until(
            expect.presence_of_element_located((By.NAME, 'password'))
        )
        time.sleep(2)
        passwd.send_keys(self.password)

        next = WebDriverWait(browser, 2).until(
            expect.element_to_be_clickable((By.ID, 'passwordNext'))
        )
        next.click()

        self.assertIn('Dashboard | TolaActivity', browser.title)
        # b.get('https://tola-activity-demo.mercycorps.org/')
        # self.assertIn('Mercy Corps Sign-On', b.title)
        #
        # b.get('https://tola-activity-qa.mercycorps.org/')
        # self.assertIn('Mercy Corps Sign-On', b.title)
        #
        # b.get('https://tola-activity.mercycorps.org/')
        # self.assertIn('Mercy Corps Sign-On', b.title)

if __name__ == '__main__':
    unittest.main(verbosity=2)
