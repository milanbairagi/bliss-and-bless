from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Order
from .serializers import OrderSerializer


class OrderCreateView(CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class OrderDetailView(RetrieveAPIView):
    queryset = Order.objects.prefetch_related("items__product", "items__color")
    serializer_class = OrderSerializer
    lookup_field = "reference_id"


class ShippingFeeView(APIView):
    def get(self, request, *args, **kwargs):
        data = {
            "fee": 150,
            "threshold": 1000,
        }
        return Response(data)