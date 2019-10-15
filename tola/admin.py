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
        # see ticket #459 to see why this is removed
        # No permissions 'is_superuser', 'user_permissions'
        (u'Permissions', {'fields': ('is_active', 'is_staff', 'groups')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
        # (_('Groups'), {'fields': ('groups',)}),
    )

    actions = ['make_active', 'make_inactive']
    list_filter = ['is_active', 'is_staff', 'is_superuser', 'date_joined',
                   'last_login']

    # print(UserAdmin.fieldsets)
    form = MyUserChangeForm
    add_form = MyUserCreationForm

    # Added a bit to the queryset to ensure AF users are always included.
    def get_queryset(self, request):
        queryset = super(MyUserAdmin, self).get_queryset(request)
        if request.user.is_superuser is False:
            user_country = request.user.tola_user.country
            queryset = queryset.filter(tola_user__country__pk__in=[user_country.pk, 1])
        return queryset


# Re-register UserAdmin with custom options
admin.site.unregister(User)
admin.site.register(User, MyUserAdmin)
