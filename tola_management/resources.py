from collections import OrderedDict
from django.db.models import Value
from django.db.models import CharField as DBCharField
from django.db.models import IntegerField as DBIntegerField
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.serializers import (
    Serializer,
    CharField,
    IntegerField,
    PrimaryKeyRelatedField,
    BooleanField,
    HiddenField,
)

from feed.views import SmallResultsSetPagination

from workflow.models import (
    Program,
)


class Paginator(SmallResultsSetPagination):
    def get_paginated_response(self , data):
        response = Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('page_count', self.page.paginator.num_pages),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data),
        ]))
        return response

class ProgramAdminSerializer(Serializer):
    id = IntegerField()
    name = CharField(max_length=255)
    organization = CharField()
    organization_count = HiddenField(default=1)
    user_count = IntegerField()
    funding_status = CharField()

    class Meta:
        fields = (
            'id',
            'name',
            'organization',
            'organization_count',
            'funding_status',
        )


class ProgramAdminViewSet(viewsets.ModelViewSet):
    serializer_class = ProgramAdminSerializer
    pagination_class = Paginator

    def get_queryset(self):
        params = self.request.query_params

        queryset = Program.objects.annotate(
            organization=Value('Mercy Corps', output_field=DBCharField()),
            user_count = Value('0', output_field=DBIntegerField()),
        )


        programStatus = params.get('programStatus')
        if programStatus == 'Active':
            queryset = queryset.filter(funding_status='Funded')
        elif programStatus == 'Closed':
            queryset = queryset.exclude(funding_status='Funded')

        programParam = params.get('programs')
        if programParam:
            queryset = queryset.filter(id=programParam)

        return queryset

    def list(self, request):
        queryset = self.get_queryset()
        page = self.paginate_queryset(list(queryset))
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)