from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListAPIView, RetrieveAPIView
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (
    OpenApiParameter,
    PolymorphicProxySerializer,
    extend_schema,
)

from .filters import ProductFilter
from .models import Product
from .serializers import (
    MultipleColorsProductResponseSerializer,
    ProductListSerializer,
    ProductSerializer,
    SingleColorProductResponseSerializer,
)


@extend_schema(
    summary="List products",
    description=(
        "Optionally filter products with `featured=true` or `featured=false` "
        "and by category, for example `category=bracelet`."
    ),
    parameters=[
        OpenApiParameter(
            name="featured",
            type=OpenApiTypes.BOOL,
            location=OpenApiParameter.QUERY,
            description="Filter by featured status.",
        ),
        OpenApiParameter(
            name="category",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description="Filter by category name. Use `all` for every category.",
        ),
    ],
)
class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductListSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter


@extend_schema(
    summary="Retrieve a product",
    description=(
        "A single-color product returns scalar image and stock values and a "
        "single color object. A multiple-color product returns color-grouped "
        "image, other-image, and stock arrays, plus an array of color objects."
    ),
    responses={
        200: PolymorphicProxySerializer(
            component_name="ProductDetailResponse",
            serializers=[
                SingleColorProductResponseSerializer,
                MultipleColorsProductResponseSerializer,
            ],
            resource_type_field_name=None,
        )
    },
)
class ProductDetailView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = "slug"