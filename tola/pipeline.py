"""Social auth pipeline functions for Google Social Auth"""
from django.conf import settings
from django.http import HttpResponseRedirect

def domains_allowed(backend, details, response, *args, **kwargs):
    if 'email' in details and details['email'] and len(details['email'].split('@')) > 1:
        domain = details['email'].split('@')[-1]
        if not settings.DEBUG and domain in settings.SOCIAL_AUTH_GOOGLE_OAUTH2_OKTA_DOMAINS:
            # redirects user to okta login if they are in OKTA domains
            return HttpResponseRedirect('/login/saml/?idp=okta')