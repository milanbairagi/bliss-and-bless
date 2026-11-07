import re

from django.db import transaction
from rest_framework import serializers

from products.models import Product, ProductColor

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    key = serializers.CharField(write_only=True)

    class Meta:
        model = OrderItem
        fields = ["key", "quantity"]

    def validate(self, attrs):
        key = attrs.pop("key")
        slug, separator, variant = key.partition(":")
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug) or (
            separator and (not variant or ":" in variant)
        ):
            raise serializers.ValidationError(
                "Key must be a slug or a slug followed by a variant."
            )

        try:
            product = Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            raise serializers.ValidationError(
                {"key": "Product does not exist."}
            )

        color = None
        if separator:
            try:
                color = ProductColor.objects.get(
                    product=product, name=variant
                )
            except ProductColor.DoesNotExist:
                raise serializers.ValidationError(
                    {"key": "Product variant does not exist."}
                )

        attrs["product"] = product
        attrs["color"] = color
        return attrs

    def to_representation(self, instance):
        key = instance.product.slug
        if instance.color:
            key = f"{key}:{instance.color.name}"
        return {"key": key, "quantity": instance.quantity}

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "Quantity must be greater than zero."
            )
        return value


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "reference_id",
            "email",
            "first_name",
            "last_name",
            "address",
            "city",
            "phone",
            "latitude",
            "longitude",
            "status",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "reference_id",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate_items(self, value):
        item_references = [
            (item["product"].pk, item["color"].pk if item["color"] else None)
            for item in value
        ]
        if len(item_references) != len(set(item_references)):
            raise serializers.ValidationError(
                "Each item key may only appear once."
            )
        if not item_references:
            raise serializers.ValidationError(
                "An order must contain at least one item."
            )
        return value

    @transaction.atomic
    def create(self, validated_data):
        items = validated_data.pop("items")
        order = Order.objects.create(**validated_data)
        OrderItem.objects.bulk_create(
            [OrderItem(order=order, **item) for item in items]
        )
        return order
