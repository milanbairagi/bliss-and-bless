from django import forms
from django.contrib import admin
from django.db import models
from django.utils.html import format_html

from .models import (
    Category,
    Product,
    ProductColor,
    ProductDetail,
    ProductImage,
    ProductStock,
)


class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 1
    fields = ("name", "hex")
    ordering = ("name",)
    verbose_name_plural = "Colors"


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3
    fields = ("preview", "image", "color", "is_primary", "position")
    ordering = ("-is_primary", "position", "id")
    verbose_name_plural = (
        "Images - mark one as primary; leave the rest as other images"
    )
    readonly_fields = ("preview",)

    @admin.display(description="Preview")
    def preview(self, obj):
        if not obj.pk or not obj.image:
            return "Upload an image"
        return format_html(
            '<img src="{}" width="72" height="72" '
            'style="object-fit: cover; border-radius: 6px;" alt="{}">',
            obj.image.url,
            obj.image.name,
        )


class ProductDetailInline(admin.TabularInline):
    model = ProductDetail
    extra = 3
    fields = ("name", "value", "position")
    ordering = ("position", "id")
    verbose_name_plural = "Product details"


class ProductStockInline(admin.TabularInline):
    model = ProductStock
    extra = 1
    fields = ("color", "quantity")
    verbose_name_plural = (
        "Stock - use one row per color, or leave color empty for a single stock total"
    )


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "make", "is_featured")
    list_filter = ("category", "make", "is_featured")
    search_fields = ("name", "description", "slug")
    autocomplete_fields = ("category",)
    prepopulated_fields = {"slug": ("name",)}
    list_select_related = ("category",)
    list_per_page = 25
    inlines = (
        ProductColorInline,
        ProductImageInline,
        ProductDetailInline,
        ProductStockInline,
    )
    fieldsets = (
        (
            "Product information",
            {
                "fields": (
                    "name",
                    "slug",
                    "description",
                    ("price", "category", "make"),
                    "is_featured",
                )
            },
        ),
    )
    formfield_overrides = {
        models.TextField: {"widget": forms.Textarea(attrs={"rows": 5})},
    }


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    search_fields = ("name",)
    ordering = ("name",)
    list_display = ("name",)


@admin.register(ProductColor)
class ProductColorAdmin(admin.ModelAdmin):
    list_display = ("name", "product", "hex")
    list_filter = ("product",)
    search_fields = ("name", "product__name")
    autocomplete_fields = ("product",)


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("preview", "product", "color", "is_primary", "position")
    list_filter = ("is_primary", "color")
    search_fields = ("product__name", "image")
    autocomplete_fields = ("product", "color")
    readonly_fields = ("preview",)

    @admin.display(description="Preview")
    def preview(self, obj):
        if not obj.image:
            return "No image"
        return format_html(
            '<img src="{}" width="72" height="72" '
            'style="object-fit: cover; border-radius: 6px;" alt="{}">',
            obj.image.url,
            obj.image.name,
        )


@admin.register(ProductDetail)
class ProductDetailAdmin(admin.ModelAdmin):
    list_display = ("product", "name", "value", "position")
    search_fields = ("product__name", "name", "value")
    autocomplete_fields = ("product",)


@admin.register(ProductStock)
class ProductStockAdmin(admin.ModelAdmin):
    list_display = ("product", "color", "quantity")
    list_filter = ("color",)
    search_fields = ("product__name", "color__name")
    autocomplete_fields = ("product", "color")
