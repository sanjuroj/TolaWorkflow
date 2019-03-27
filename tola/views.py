import urllib
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic.list import ListView
from tola.forms import ProfileUpdateForm, NewUserRegistrationForm, NewTolaUserRegistrationForm, BookmarkForm
from django.contrib import messages
from django.contrib.auth import logout
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.urls import reverse_lazy, reverse
from workflow.models import ProjectAgreement, ProjectComplete, Program, SiteProfile, Sector,Country, TolaUser,TolaSites, TolaBookmarks, FormGuidance
from indicators.models import Indicator
from social_django.utils import load_strategy, load_backend

from django.shortcuts import get_object_or_404
from django.db.models import Sum, Q, Count
from tola.util import getCountry
from django.contrib.auth.models import Group
from django.utils.translation import gettext as _
from django.contrib.auth import views as authviews
from indicators.queries import ProgramWithMetrics

from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.core.exceptions import PermissionDenied


@login_required(login_url='/accounts/login/')
def index(request, selected_country=None):
    """
    Home page
    """

    # Find the active country
    user = request.user.tola_user
    user_countries = user.available_countries # all countries whose programs are available to the user

    if selected_country:  # from URL
        if not user.available_countries.filter(id=selected_country).exists():
            raise PermissionDenied

        active_country = Country.objects.filter(id=selected_country)[0]
        user.update_active_country(active_country)
    else:
        try:
            # default to first country in user's accessible countries
            active_country = user.active_country if user.active_country else user_countries[0]
        except IndexError:
            # ... or failing that, to their "home" country
            active_country = user.country
            # ... failing all of this, the homepage will be blank. Sorry!

    active_country_id = None
    if active_country:
        active_country_id = active_country.id

    programs_with_metrics = ProgramWithMetrics.home_page.with_annotations().filter(
        Q(country__in=user.countries.filter(id=active_country_id)) | Q(programaccess__tolauser=user, programaccess__country=active_country) | Q(country=user.country),
        country=active_country,
        funding_status="Funded"
    ).distinct()

    sites_with_results = SiteProfile.objects.all()\
        .prefetch_related('country', 'district', 'province') \
        .filter(Q(result__program__country=active_country))\
        .filter(status=1)

    sites_without_results = SiteProfile.objects.all() \
        .prefetch_related('country', 'district', 'province') \
        .filter(Q(country=active_country) & ~Q(result__program__country=active_country)) \
        .filter(status=1)

    return render(request, 'home.html', {
        'user_countries': user_countries,
        'active_country': active_country,
        'programs': programs_with_metrics,
        'no_programs': programs_with_metrics.count(),
        'sites_without_results': sites_without_results,
        'sites_with_results': sites_with_results,
    })

class TolaLoginView(authviews.LoginView):
    def get_context_data(self, *args, **kwargs):
        context = super(TolaLoginView, self).get_context_data(*args, **kwargs)
        context['okta_url'] = u"{base}?{params}".format(
            base=reverse('social:begin', kwargs={'backend': 'saml'}),
            params=urllib.urlencode({'next': '/', 'idp': 'okta'})
        )
        return context

def register(request):
    """
    Register a new User profile using built in Django Users Model
    """
    privacy = TolaSites.objects.get(id=1)
    if request.method == 'POST':
        uf = NewUserRegistrationForm(request.POST)
        tf = NewTolaUserRegistrationForm(request.POST)

        if uf.is_valid() * tf.is_valid():
            user = uf.save()
            user.groups.add(Group.objects.get(name='ViewOnly'))

            tolauser = tf.save(commit=False)
            tolauser.user = user
            tolauser.save()
            messages.error(request, _('Thank you, You have been registered as a new user.'), fail_silently=False)
            return HttpResponseRedirect("/")
    else:
        uf = NewUserRegistrationForm()
        tf = NewTolaUserRegistrationForm()

    return render(request, "registration/register.html", {
        'userform': uf,'tolaform': tf, 'helper': NewTolaUserRegistrationForm.helper,'privacy':privacy
    })


def profile(request):
    """
    Update a User profile using built in Django Users Model if the user is logged in
    otherwise redirect them to registration version
    """
    if request.user.is_authenticated():
        obj = get_object_or_404(TolaUser, user=request.user)
        form = ProfileUpdateForm(request.POST or None, instance=obj, user=request.user)

        if request.method == 'POST':
            if form.is_valid():
                form.save()
                messages.error(request, _('Your profile has been updated.'), fail_silently=False,
                               extra_tags='success')
                # immediately redirect so user sees language change
                return HttpResponseRedirect(reverse_lazy('profile'))
        return render(request, "registration/profile.html", {
            'form': form, 'helper': ProfileUpdateForm.helper
        })

    else:
        return HttpResponseRedirect(reverse_lazy('register'))

def saml_metadata_view(request):
    complete_url = reverse('social:complete', args=("saml", ))
    saml_backend = load_backend(
        load_strategy(request),
        "saml",
        redirect_uri=complete_url,
    )
    metadata, errors = saml_backend.generate_metadata_xml()
    print(errors)
    if not errors:
        return HttpResponse(content=metadata, content_type='text/xml')
    else:
        return HttpResponse(status=500)


class BookmarkList(LoginRequiredMixin, ListView):
    """
    Bookmark Report filtered by project
    """
    model = TolaBookmarks
    template_name = 'registration/bookmark_list.html'

    def get(self, request, *args, **kwargs):
        getUser = TolaUser.objects.all().filter(user=request.user)
        getBookmarks = TolaBookmarks.objects.all().filter(user=getUser)

        return render(request, self.template_name, {'getBookmarks': getBookmarks})


class BookmarkCreate(LoginRequiredMixin, CreateView):
    """
    Using Bookmark Form for new bookmark per user
    """
    model = TolaBookmarks
    template_name = 'registration/bookmark_form.html'

    def dispatch(self, request, *args, **kwargs):
        try:
            self.guidance = FormGuidance.objects.get(form="Bookmarks")
        except FormGuidance.DoesNotExist:
            self.guidance = None
        return super(BookmarkCreate, self).dispatch(request, *args, **kwargs)

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(BookmarkCreate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def get_initial(self):

        initial = {
            'user': self.request.user,
        }

        return initial

    def form_invalid(self, form):

        messages.error(self.request, _('Invalid Form'), fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        form.save()
        messages.success(self.request, _('Success, Bookmark Created!'))
        latest = TolaBookmarks.objects.latest('id')
        redirect_url = '/bookmark_update/' + str(latest.id)
        return HttpResponseRedirect(redirect_url)

    form_class = BookmarkForm


class BookmarkUpdate(LoginRequiredMixin, UpdateView):
    """
    Bookmark Form Update an existing site profile
    """
    model = TolaBookmarks
    template_name = 'registration/bookmark_form.html'

    def dispatch(self, request, *args, **kwargs):
        try:
            self.guidance = FormGuidance.objects.get(form="Bookmarks")
        except FormGuidance.DoesNotExist:
            self.guidance = None
        return super(BookmarkUpdate, self).dispatch(request, *args, **kwargs)

    def get_initial(self):

        initial = {
            'user': self.request.user,
        }

        return initial

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        form.save()
        messages.success(self.request, _('Success, Bookmark Updated!'))
        latest = TolaBookmarks.objects.latest('id')
        redirect_url = '/bookmark_update/' + str(latest.id)
        return HttpResponseRedirect(redirect_url)

    form_class = BookmarkForm


class BookmarkDelete(LoginRequiredMixin, DeleteView):
    """
    Bookmark Form Delete an existing bookmark
    """
    model = TolaBookmarks
    template_name = 'registration/bookmark_confirm_delete.html'
    success_url = "/bookmark_list"

    def dispatch(self, request, *args, **kwargs):
        return super(BookmarkDelete, self).dispatch(request, *args, **kwargs)

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()

        messages.success(self.request, _('Success, Bookmark Deleted!'))
        return self.render_to_response(self.get_context_data(form=form))

    form_class = BookmarkForm


def logout_view(request):
    """
    Logout a user
    """
    logout(request)
    # Redirect to a success page.
    return HttpResponseRedirect("/")
