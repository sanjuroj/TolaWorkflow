import sys
import itertools
from collections import defaultdict
from getpass import getpass
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db.models.deletion import Collector
from workflow.models import (
    Program, Country, TolaUser, Organization, ProjectAgreement, ProjectComplete,
    SiteProfile, Stakeholder, Documentation, Budget)


class Command(BaseCommand):
    help = """
        Deletes non-Afghanistan data from database
        """

    def handle(self, *args, **options):

        all_project_agreement_count_start = ProjectAgreement.objects.count()
        all_project_complete_count_start = ProjectComplete.objects.count()
        af_project_agreement_count_start = ProjectAgreement.objects.filter(
            program__country__country="Afghanistan").count()
        af_project_complete_count_start = ProjectComplete.objects.filter(
            program__country__country="Afghanistan").count()

        print 'All ProjectAgreements before script was run:', all_project_agreement_count_start
        print 'All ProjectCompletes before script was run:', all_project_complete_count_start
        print 'AF ProjectAgreements before script was run:', af_project_agreement_count_start
        print 'AF ProjectCompletes before script was run:', af_project_complete_count_start

        # First delete non-Afghanistan countries
        countries_to_delete = Country.objects.exclude(country="Afghanistan")
        print 'countries before delete', Country.objects.count()
        countries_to_delete.delete()
        print 'countries after delete', Country.objects.count()
        print "\n+++++++++++++++++++++++++++++++\n"

        # Get rid of non-Afghanistan programs.  This should preserve any program that is linked to both AF
        # and another Country.
        programs_to_delete = Program.objects.exclude(country__country="Afghanistan")
        print 'programs before delete', Program.objects.count()
        programs_to_delete.delete()
        print 'programs after delete', Program.objects.count()
        print "\n+++++++++++++++++++++++++++++++\n"

        # Now get rid of non-AF users, sort of.  The approval system for projects links several different fields in
        # PA and PC to user ids.  But some of these users may have moved on from AF.  So to ensure data related to
        # PAs and PCs isn't lost, we'll need to preserve a union of current users assigned to AF and any user
        # who has ever been associated with a PA or PC.
        print 'Users before delete', User.objects.count()
        pa_user_associations = ProjectAgreement.objects.filter(program__country__country="Afghanistan").values_list(
            'estimated_by', 'checked_by', 'reviewed_by', 'finance_reviewed_by', 'me_reviewed_by',
            'approved_by', 'approval_submitted_by'
        )
        unique_pa_user_ids = {item for item in itertools.chain.from_iterable(pa_user_associations)}

        pc_user_associations = ProjectComplete.objects.filter(program__country__country="Afghanistan").values_list(
            'estimated_by', 'checked_by', 'reviewed_by', 'approved_by', 'approval_submitted_by'
        )
        unique_pc_user_ids = {item for item in itertools.chain.from_iterable(pc_user_associations)}

        unique_af_user_ids = set(list(
            TolaUser.objects.filter(country__country="Afghanistan").values_list('id', flat=True)))

        print 'unique pa', len(unique_pa_user_ids)
        print 'unique pc', len(unique_pc_user_ids)
        print 'unique af', len(unique_af_user_ids)

        print 'pa & pc intersection', len(unique_pa_user_ids & unique_pc_user_ids)
        print 'pa & af intersection', len(unique_af_user_ids & unique_pa_user_ids)

        tolauser_ids_to_preserve = [item for item in (
            unique_af_user_ids | unique_pa_user_ids | unique_pc_user_ids) if item]
        print 'count of tola users to preserve', len(tolauser_ids_to_preserve)

        tolausers_to_delete = TolaUser.objects.exclude(id__in=tolauser_ids_to_preserve).select_related('user')
        users_to_delete = User.objects.exclude(tola_user__id__in=tolauser_ids_to_preserve)
        print 'count of auth users to delete', len(users_to_delete)

        print 'auth user count before: {}'.format(User.objects.count())
        print 'tolauser count before: {}'.format(TolaUser.objects.count())
        print 'users to delete: {}'.format(len(tolausers_to_delete))
        users_to_delete.delete()
        tolausers_to_delete.delete()
        print 'user count after: {}'.format(User.objects.count())
        print 'tolauser count after: {}'.format(TolaUser.objects.count())
        print "\n+++++++++++++++++++++++++++++++\n"

        # In testing there wer 5 budgets that were null for both ProjectAgreement and ProjectComplete.  They were
        # also somewhat old (2015 and 2017), so deleting them seems to make sense.
        print "Budgets before deletion: ", Budget.objects.count()
        budgets_to_delete = Budget.objects.exclude(agreement__program__country__country="Afghanistan") \
            .exclude(complete__program__country__country="Afghanistan")
        # .filter(agreement__isnull=True).filter(complete__isnull=True)
        print "Deleting budget ids ", [budget.id for budget in budgets_to_delete]
        if len(budgets_to_delete) == 5:
            budgets_to_delete.delete()
        else:
            print "SKIPPED DELETING BUDGETS! In testing, there should be only 5 budgets to delete but there were {}"\
                .format(len(budgets_to_delete))
        print "Budgets after deletion: ", Budget.objects.count()
        print "\n+++++++++++++++++++++++++++++++\n"

        # In testing, anything after this point has already been deleted because of the deletion cascades of the
        # objects above.  But since it's not entirely clear what will cascade and what won't, it's worth
        # being explicit.

        # Delete non-Afghanistan sites
        print "Sites before deletion: ", SiteProfile.objects.count()
        sites_to_delete = SiteProfile.objects.exclude(country__country="Afghanistan")
        sites_to_delete.delete()
        print "Sites after deletion: ", SiteProfile.objects.count()
        print "\n+++++++++++++++++++++++++++++++\n"

        # Delete non-Afghanistan stakeholders
        print "Stakeholders before deletion: ", Stakeholder.objects.count()
        stakeholders_to_delete = Stakeholder.objects.exclude(country__country="Afghanistan")
        print "Count of stakeholders to delete: ", stakeholders_to_delete.count()
        stakeholders_to_delete.delete()
        print "Stakeholders after deletion: ", Stakeholder.objects.count()
        print "\n+++++++++++++++++++++++++++++++\n"

        # Delete non-Afghanistan Documents
        print "Documents before deletion: ", Documentation.objects.count()
        documents_to_delete = Documentation.objects.exclude(program__country__country="Afghanistan")
        print "Count of documents to delete: ", documents_to_delete.count()
        documents_to_delete.delete()
        print "Documents after deletion: ", Documentation.objects.count()
        print "\n+++++++++++++++++++++++++++++++\n"

        # Delete non-Afghanistan projects
        print "ProjectAgreements before deletion: ", ProjectAgreement.objects.count()
        print "ProjectCompletes before deletion: ", ProjectComplete.objects.count()
        pas_to_delete = ProjectAgreement.objects.exclude(program__country__country="Afghanistan")
        pcs_to_delete = ProjectComplete.objects.exclude(program__country__country="Afghanistan")
        print "Count of project agreements to delete: ", pas_to_delete.count()
        print "Count of project completes to delete: ", pcs_to_delete.count()
        pas_to_delete.delete()
        pcs_to_delete.delete()
        print "ProjectAgreements after deletion: ", ProjectAgreement.objects.count()
        print "ProjectCompletes after deletion: ", ProjectComplete.objects.count()
        print "\n+++++++++++++++++++++++++++++++\n"

        # Final object counts
        print 'All ProjectAgreements before script was run:', all_project_agreement_count_start
        print 'All ProjectCompletes before script was run:', all_project_complete_count_start
        print 'AF ProjectAgreements before script was run:', af_project_agreement_count_start
        print 'AF ProjectCompletes before script was run:', af_project_complete_count_start

        print 'All ProjectAgreements after script was run:', ProjectAgreement.objects.count()
        print 'All ProjectCompletes after script was run:', ProjectComplete.objects.count()
        print 'AF ProjectAgreements after script was run:', ProjectAgreement.objects.filter(
            program__country__country="Afghanistan").count()
        print'AF ProjectCompletes after script was run:', ProjectComplete.objects.filter(
            program__country__country="Afghanistan").count()

        print'Sites in Afghanistan after all deletions', \
            SiteProfile.objects.filter(country__country="Afghanistan").count()

    @staticmethod
    def get_related_models(queryset):
        related_objects = defaultdict(dict)
        for main_object in queryset:
            collector = Collector(using='default')  # or specific database
            collector.collect([main_object])
            main_key = main_object.id

            for model, instance in collector.instances_with_model():
                try:
                    related_objects[main_key][model.__name__].append(instance)
                except KeyError:
                    related_objects[main_key][model.__name__] = [instance]

        return related_objects

    @staticmethod
    def create_test_user():
        organization = Organization.objects.get(pk=1)
        test_user, created = User.objects.get_or_create(username="testuser")
        test_user.first_name = "testfirst"
        test_user.last_name = "testlast"
        password = getpass("Enter password for test user: ")
        test_user.set_password(password)
        test_user.save()
        test_tolauser, created = TolaUser.objects.get_or_create(
            user=test_user,
            defaults={'organization': organization, 'name': 'testname'})
        test_tolauser.country = Country.objects.get(country='Afghanistan')
