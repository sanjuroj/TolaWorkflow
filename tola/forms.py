from crispy_forms.helper import FormHelper
from crispy_forms.layout import *
from crispy_forms.bootstrap import *
from crispy_forms.layout import Layout, Submit, Reset, Div
from django import forms
from django.contrib.auth.forms import UserCreationForm
from workflow.models import TolaUser, TolaBookmarks
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _


class ProfileUpdateForm(forms.ModelForm):
    """
    Form for registering a new account.
    """
    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super(ProfileUpdateForm, self).__init__(*args, **kwargs)

    class Meta:
        model = TolaUser
        fields = [ 'language', ]

    helper = FormHelper()
    helper.form_method = 'post'
    helper.form_class = 'hide-askerisks'
    helper.label_class = ''
    helper.field_class = ''
    helper.form_error_title = _('Form Errors')
    helper.error_text_inline = True
    helper.help_text_inline = True
    helper.html5_required = True
    helper.layout = Layout(
        Field( 'language' ),
        Div(
            FormActions(
                Submit('submit', _('Save changes'), css_class=''),
                Reset('reset', _('Cancel'), css_class='')
            ),
        ),
    )


class NewUserRegistrationForm(UserCreationForm):
    """
    Form for registering a new account.
    """
    class Meta:
        model = User
        fields = ['first_name', 'last_name','email','username']

    def __init__(self, *args, **kwargs):
        super(NewUserRegistrationForm, self).__init__(*args, **kwargs)


    helper = FormHelper()
    helper.form_method = 'post'
    helper.form_class = 'form-horizontal'
    helper.label_class = 'col-sm-2'
    helper.field_class = 'col-sm-6'
    helper.form_error_title = 'Form Errors'
    helper.error_text_inline = True
    helper.help_text_inline = True
    helper.html5_required = True
    helper.form_tag = False


class NewTolaUserRegistrationForm(forms.ModelForm):
    """
    Form for registering a new account.
    """
    class Meta:
        model = TolaUser
        fields = ['title', 'country', 'privacy_disclaimer_accepted']

    def __init__(self, *args, **kwargs):
        super(NewTolaUserRegistrationForm, self).__init__(*args, **kwargs)

    helper = FormHelper()
    helper.form_method = 'post'
    helper.form_class = 'form-horizontal'
    helper.label_class = 'col-sm-2'
    helper.field_class = 'col-sm-6'
    helper.form_error_title = 'Form Errors'
    helper.error_text_inline = True
    helper.help_text_inline = True
    helper.html5_required = True
    helper.form_tag = False
    helper.layout = Layout(
        Fieldset('Information','title', 'country'),
        Fieldset('Privacy Statement','privacy_disclaimer_accepted',),

    )

class BookmarkForm(forms.ModelForm):
    """
    Form for registering a new account.
    """
    class Meta:
        model = TolaBookmarks
        fields = ['name', 'bookmark_url']

    def __init__(self, *args, **kwargs):
        super(BookmarkForm, self).__init__(*args, **kwargs)

    helper = FormHelper()
    helper.form_method = 'post'
    helper.form_class = 'form-horizontal'
    helper.label_class = 'col-sm-2'
    helper.field_class = 'col-sm-6'
    helper.form_error_title = 'Form Errors'
    helper.error_text_inline = True
    helper.help_text_inline = True
    helper.html5_required = True
    helper.form_tag = True
    helper.layout = Layout(
        Fieldset('','name','bookmark_url'),
        Submit('submit', _('Submit'), css_class='btn-default'),
        Reset('reset', _('Reset'), css_class='btn-warning'))


