from rest_framework import serializers

from .models import Product, ProductColor


class ProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = ["name", "hex"]


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name", read_only=True)
    price = serializers.DecimalField(
        max_digits=10, decimal_places=2, coerce_to_string=False
    )
    colors = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    other_images = serializers.SerializerMethodField()
    details = serializers.SerializerMethodField()
    stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "slug",
            "name",
            "description",
            "price",
            "colors",
            "category",
            "make",
            "image",
            "other_images",
            "details",
            "stock",
        ]

    def get_colors(self, product):
        colors = list(product.colors.all())
        if not colors:
            return None
        if len(colors) == 1:
            return ProductColorSerializer(colors[0]).data
        return ProductColorSerializer(colors, many=True).data

    def get_image(self, product):
        images = product.images.filter(is_primary=True)
        if product.colors.count() > 1:
            return [
                {"color": image.color.name, "url": image.image.url}
                for image in images
                if image.color is not None
            ]
        image = images.first()
        return image.image.url if image else None

    def get_other_images(self, product):
        images = product.images.filter(is_primary=False)
        if product.colors.count() > 1:
            grouped_images = []
            for color in product.colors.all():
                color_images = images.filter(color=color)
                if color_images.exists():
                    grouped_images.append(
                        {
                            "color": color.name,
                            "urls": [
                                image.image.url for image in color_images
                            ],
                        }
                    )
            return grouped_images
        return [image.image.url for image in images]

    def get_details(self, product):
        return [
            [detail.name, detail.value] for detail in product.details.all()
        ]

    def get_stock(self, product):
        stock = product.stock.all()
        if product.colors.count() > 1:
            return [
                {"color": item.color.name, "quantity": item.quantity}
                for item in stock
                if item.color is not None
            ]
        item = stock.filter(color__isnull=True).first() or stock.first()
        return item.quantity if item else 0
