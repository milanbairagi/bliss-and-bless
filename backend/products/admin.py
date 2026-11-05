from django.contrib import admin
from .models import Product, ProductColor, ProductImage, ProductDetail, ProductStock, Category


admin.site.register(Product)
admin.site.register(ProductColor)
admin.site.register(ProductImage)
admin.site.register(ProductDetail)
admin.site.register(ProductStock)
admin.site.register(Category)
