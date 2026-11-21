from rest_framework import serializers

from .models import Product, ProductColor


class ProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = ["name", "hex"]


class SingleColorProductResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    slug = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    colors = ProductColorSerializer(allow_null=True)
    category = serializers.CharField()
    make = serializers.CharField()
    image = serializers.CharField(allow_null=True)
    other_images = serializers.ListField(child=serializers.CharField())
    details = serializers.ListField(
        child=serializers.ListField(child=serializers.CharField())
    )
    stock = serializers.IntegerField()


class ProductColorImageSerializer(serializers.Serializer):
    color = serializers.CharField()
    url = serializers.CharField()


class ProductColorImagesSerializer(serializers.Serializer):
    color = serializers.CharField()
    urls = serializers.ListField(child=serializers.CharField())


class ProductColorStockSerializer(serializers.Serializer):
    color = serializers.CharField()
    quantity = serializers.IntegerField()


class MultipleColorsProductResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    slug = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    colors = serializers.ListField(child=ProductColorSerializer())
    category = serializers.CharField()
    make = serializers.CharField()
    image = serializers.ListField(child=ProductColorImageSerializer())
    other_images = serializers.ListField(child=ProductColorImagesSerializer())
    details = serializers.ListField(
        child=serializers.ListField(child=serializers.CharField())
    )
    stock = serializers.ListField(child=ProductColorStockSerializer())


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

    def _get_image_url(self, image):
        return image.image.url

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
                {"color": image.color.name, "url": self._get_image_url(image)}
                for image in images
                if image.color is not None
            ]
        image = images.first()
        return self._get_image_url(image) if image else None

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
                                self._get_image_url(image) for image in color_images
                            ],
                        }
                    )
            return grouped_images
        return [self._get_image_url(image) for image in images]

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


class ProductListSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name", read_only=True)
    price = serializers.DecimalField(
        max_digits=10, decimal_places=2, coerce_to_string=False
    )
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "slug", "name", "description", "price", "category", "image"]

    def get_image(self, product):
        image = product.images.filter(is_primary=True).first()
        if image:
            return image.image.url
        return None