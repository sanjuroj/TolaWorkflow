from django import forms
from django.utils.translation import ugettext_lazy as _
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm


# use these form classes to enforce unique emails, if required
class UniqueEmailForm:
    def clean_email(self):
        qs = User.objects.filter(email=self.cleaned_data['email'])
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.count():
            raise forms.ValidationError(
                'That email address is already in use')
        else:
            return self.cleaned_data['email']


class MyUserChangeForm(UniqueEmailForm, UserChangeForm):
    email = forms.EmailField(required=True)


class MyUserCreationForm(UniqueEmailForm, UserCreationForm):
    email = forms.EmailField(required=True)


class MyUserAdmin(UserAdmin):
    # add the email field in to the initial add_user form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2')
        }),
    )
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        # No permissions 'is_superuser',
        (u'Permissions', {'fields': ('is_active', 'is_staff', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
        # (_('Groups'), {'fields': ('groups',)}),
    )

    actions = ['make_active', 'make_inactive']
    list_filter = ['is_active', 'is_staff', 'is_superuser', 'date_joined',
                   'last_login']

    # print(UserAdmin.fieldsets)
    form = MyUserChangeForm
    add_form = MyUserCreationForm


# Re-register UserAdmin with custom options
admin.site.unregister(User)
admin.site.register(User, MyUserAdmin)
