from collections import OrderedDict
import csv
from workflow.models import Country, Province, District, AdminLevelThree, Village

"""
Import Countries and other admin levels from a csv file.  First column should be country, second
should be province, etc...

Requires module django-extensions

Syntax: sudo py manage.py runscript import_adminlevels --script-args /path/to/file.csv
"""


def run(*args):
    counts = OrderedDict([
        ('countries', 0), ('provinces', 0), ('districts', 0), ('admin level 3s', 0),
        ('villages', 0), ])

    with open(args[0], 'rb') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in reader:
            try:
                c, created = Country.objects.get_or_create(country=row[0])
                if created:
                    counts['countries'] += 1

                p, created = Province.objects.get_or_create(name=row[1], country=c)
                if created:
                    counts['provinces'] += 1

                d, created = District.objects.get_or_create(name=row[2], province=p)
                if created:
                    counts['districts'] += 1

                a3, created = AdminLevelThree.objects.get_or_create(name=row[3], district=d)
                if created:
                    counts['admin level 3s'] += 1

                v, created = Village.objects.get_or_create(name=row[4], admin_3=a3, district=d)
                if created:
                    counts['villages'] += 1

            except IndexError:
                pass

    for key in counts:
        print "Inserted %s %s" % (key, counts[key])
