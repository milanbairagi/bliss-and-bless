from rest_framework.generics import CreateAPIView, RetrieveAPIView

from .models import Order
from .serializers import OrderSerializer


class OrderCreateView(CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class OrderDetailView(RetrieveAPIView):
    queryset = Order.objects.prefetch_related("items__product", "items__color")
    serializer_class = OrderSerializer
    lookup_field = "reference_id"