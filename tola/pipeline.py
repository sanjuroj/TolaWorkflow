"""Social auth pipeline functions for Google Social Auth"""
from django.conf import settings
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from social_core.pipeline.social_auth import associate_by_email

def domains_allowed(backend, details, response, *args, **kwargs):
    if 'email' in details and details['email'] and len(details['email'].split('@')) > 1:
        domain = details['email'].split('@')[-1]
        if not settings.DEBUG and domain in settings.SOCIAL_AUTH_GOOGLE_OAUTH2_OKTA_DOMAINS:
            # redirects user to okta login if they are in OKTA domains
            return HttpResponseRedirect('/login/saml/?idp=okta')

def associate_email_or_redirect(backend, details, user=None, *args, **kwargs):
    if user:
        return None
    else:
        tola_user = associate_by_email(backend, details, user, *args, **kwargs)
        if tola_user is not None:
            return tola_user
        else:
            return HttpResponseRedirect(reverse("invalid_user"))