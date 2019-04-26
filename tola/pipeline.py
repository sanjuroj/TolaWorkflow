"""Social auth pipeline functions for Google Social Auth"""
from django.conf import settings
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from social_core.pipeline.social_auth import associate_by_email, social_user, associate_user

def domains_allowed(backend, details, response, *args, **kwargs):
    if 'email' in details and details['email'] and len(details['email'].split('@')) > 1:
        domain = details['email'].split('@')[-1]
        if not settings.DEBUG and domain in settings.SOCIAL_AUTH_GOOGLE_OAUTH2_OKTA_DOMAINS:
            # redirects user to okta login if they are in OKTA domains
            return HttpResponseRedirect('/login/saml/?idp=okta')


def associate_email_or_redirect(backend, details, user=None, *args, **kwargs):
    """extension of the associate_email step in the pipeline to add redirect if user not found"""
    if user:
        return None
    else:
        tola_user = associate_by_email(backend, details, user, *args, **kwargs)
        if tola_user is not None:
            return tola_user
        else:
            return HttpResponseRedirect(reverse("invalid_user"))


def social_user_tola(backend, uid, user=None, *args, **kwargs):
    """extension of the social user lookup in the pipeline to clear bad associations"""
    # try to get user from social auth storage:
    provider = backend.name
    if provider == 'google-oauth2':
        social = backend.strategy.storage.user.get_social_auth(provider, uid)
        if social and social.user.email.lower() != uid.lower():
            # we found a match, but the emails are different, delete the bad data:
            social.delete()
            user = None
    # call the original social_user now that we know bad data has been expunged:
    social = social_user(backend, uid, user, *args, **kwargs)
    return social


def associate_user_tola(backend, uid, user=None, social=None, *args, **kwargs):
    """extension of the user-association step of the pipeline to avoid associating to previously logged-in users"""
    if user and user.email and user.email.lower() != uid.lower():
        # if we have a user logged in (sessioning!) and they don't match the uid entered
        # zero out the user so we don't associate badly a user with a bad social auth:
        user = None
    return associate_user(backend, uid, user, social, *args, **kwargs)