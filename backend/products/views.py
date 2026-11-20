from rest_framework.generics import ListAPIView, RetrieveAPIView
from drf_spectacular.utils import PolymorphicProxySerializer, extend_schema

from .models import Product
from .serializers import (
    MultipleColorsProductResponseSerializer,
    ProductListSerializer,
    ProductSerializer,
    SingleColorProductResponseSerializer,
)


class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductListSerializer


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