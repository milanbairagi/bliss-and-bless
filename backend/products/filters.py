from django_filters import rest_framework as filters
from rest_framework.exceptions import ValidationError

from .models import Product


class ProductFilter(filters.FilterSet):
    featured = filters.CharFilter(
        field_name="is_featured",
        method="filter_featured",
        label="Featured",
    )
    category = filters.CharFilter(method="filter_category")

    class Meta:
        model = Product
        fields = ["featured", "category"]

    def filter_featured(self, queryset, name, value):
        normalized_value = value.lower()
        if normalized_value not in {"true", "false"}:
            raise ValidationError({"featured": "Use 'true' or 'false'."})
        return queryset.filter(is_featured=normalized_value == "true")

    def filter_category(self, queryset, name, value):
        if value.lower() == "all":
            return queryset
        return queryset.filter(category__name__iexact=value)
