from django.urls import reverse
from rest_framework.test import APITestCase

from .models import Category, Product


class ProductListAPITests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        bracelet = Category.objects.create(name="Bracelet")
        scarf = Category.objects.create(name="Scarf")
        Product.objects.create(
            name="Featured Bracelet",
            description="A featured bracelet",
            price="25.00",
            slug="featured-bracelet",
            category=bracelet,
            make=Product.Make.HANDMADE,
            is_featured=True,
        )
        Product.objects.create(
            name="Scarf",
            description="A scarf",
            price="30.00",
            slug="scarf",
            category=scarf,
            make=Product.Make.MACHINE_MADE,
        )

    def test_filters_by_featured_query_parameter(self):
        response = self.client.get(
            reverse("product-list"), {"featured": "true"}
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [product["slug"] for product in response.data],
            ["featured-bracelet"],
        )

    def test_filters_by_category_query_parameter_case_insensitively(self):
        response = self.client.get(
            reverse("product-list"), {"category": "bracelet"}
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [product["slug"] for product in response.data],
            ["featured-bracelet"],
        )

    def test_rejects_invalid_featured_query_parameter(self):
        response = self.client.get(
            reverse("product-list"), {"featured": "yes"}
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["featured"], "Use 'true' or 'false'.")
