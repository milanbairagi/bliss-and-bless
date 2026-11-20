"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from orders.views import OrderCreateView, OrderDetailView
from products.views import ProductListView, ProductDetailView

urlpatterns = [
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('admin/', admin.site.urls),
    path('api/products/', ProductListView.as_view(), name='product-list'),
    path('api/products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('api/orders/', OrderCreateView.as_view(), name='order-create'),
    path(
        'api/orders/<uuid:reference_id>/',
        OrderDetailView.as_view(),
        name='order-detail',
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
