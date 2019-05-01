from crispy_forms.helper import FormHelper
from crispy_forms.layout import *
from crispy_forms.bootstrap import *
from crispy_forms.layout import Layout, Submit, Reset, Div
from django import forms
from django.contrib.auth.forms import UserCreationForm
from workflow.models import TolaUser
from django.contrib.auth.models import User
from django.utils.translation import (
    ugettext_lazy as _,
    activate as set_language
    )


class ProfileUpdateForm(forms.ModelForm):
    """
    Form for registering a new account.
    """
    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        # moving helper button description to init so translations will re-init on reload:
        self.helper.layout = Layout(
            Field( 'language' ),
            Div(
                FormActions(
                    Submit('submit', _('Save changes'), css_class=''),
                    Reset('reset', _('Cancel'), css_class='')
                ),
            ),
        )
        super(ProfileUpdateForm, self).__init__(*args, **kwargs)
        self.fields['language'].label = _('Language')

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


    def save(self, *args, **kwargs):
        model = super(ProfileUpdateForm, self).save(*args, **kwargs)
        # explicitly update the language on form save so success messages are in the correct lang:
        set_language(model.language)
        return model


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
