from django.db import models


class Product(models.Model):
    class Make(models.TextChoices):
        HANDMADE = "handmade", "Handmade"
        MACHINE_MADE = "machine-made", "Machine-made"

    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    slug = models.SlugField(max_length=255, unique=True)
    category = models.ForeignKey(
        "Category", on_delete=models.CASCADE, related_name="products"
    )
    make = models.CharField(max_length=20, choices=Make.choices)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
    

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class ProductColor(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="colors"
    )
    name = models.CharField(max_length=50)
    hex = models.CharField(max_length=7)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product", "name"], name="unique_product_color_name"
            ),
        ]
        ordering = ["name"]

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="images"
    )
    color = models.ForeignKey(
        ProductColor,
        on_delete=models.CASCADE,
        related_name="images",
        null=True,
        blank=True,
    )
    image = models.ImageField(upload_to="product_images/")
    is_primary = models.BooleanField(default=False)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]

    def __str__(self):
        return self.image.name


class ProductDetail(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="details"
    )
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=255)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]

    def __str__(self):
        return f"{self.name}: {self.value}"


class ProductStock(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="stock"
    )
    color = models.ForeignKey(
        ProductColor,
        on_delete=models.CASCADE,
        related_name="stock",
        null=True,
        blank=True,
    )
    quantity = models.PositiveIntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product", "color"], name="unique_product_stock_color"
            ),
        ]

    def __str__(self):
        if self.color:
            return f"{self.product.name} - {self.color.name}: {self.quantity}"
        return f"{self.product.name}: {self.quantity}"
