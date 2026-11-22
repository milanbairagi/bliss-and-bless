from django.urls import reverse
from uuid import UUID

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient, APITestCase

from products.models import Category, Product, ProductColor

from .models import Order, OrderItem
from .serializers import OrderSerializer


class OrderSerializerTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        category = Category.objects.create(name="Jewelry")
        product = Product.objects.create(
            name="Bracelet",
            description="A bracelet",
            price="25.00",
            slug="bracelet",
            category=category,
            make=Product.Make.HANDMADE,
        )
        ProductColor.objects.create(
            product=product, name="rose-red", hex="#C8553D"
        )
        Product.objects.create(
            name="Scarf",
            description="A scarf",
            price="30.00",
            slug="scarf",
            category=category,
            make=Product.Make.HANDMADE,
        )

    def test_creates_order_with_key_and_quantity_items(self):
        serializer = OrderSerializer(
            data={
                "items": [
                    {"key": "bracelet:rose-red", "quantity": 2},
                    {"key": "scarf", "quantity": 1},
                ],
                "email": "maya@example.com",
                "first_name": "Maya",
                "last_name": "Sharma",
                "address": "123 Main Street",
                "city": "Kathmandu",
                "phone": "9800000000",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        order = serializer.save()

        self.assertEqual(order.items.get(product__slug="bracelet").quantity, 2)
        self.assertEqual(order.items.get(product__slug="scarf").quantity, 1)
        self.assertEqual(
            order.items.get(product__slug="bracelet").color.name, "rose-red"
        )
        self.assertEqual(order.status, Order.Status.PENDING)
        self.assertIsInstance(order.reference_id, UUID)
        self.assertEqual(
            OrderSerializer(order).data["reference_id"],
            str(order.reference_id),
        )
        self.assertEqual(
            OrderSerializer(order).data["items"],
            [
                {"key": "bracelet:rose-red", "quantity": 2},
                {"key": "scarf", "quantity": 1},
            ],
        )

    def test_status_is_read_only_in_order_serializer(self):
        serializer = OrderSerializer(
            data={
                "status": Order.Status.CANCELLED,
                "items": [{"key": "scarf", "quantity": 1}],
                "email": "maya@example.com",
                "first_name": "Maya",
                "last_name": "Sharma",
                "address": "123 Main Street",
                "city": "Kathmandu",
                "phone": "9800000000",
            }
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        order = serializer.save()

        self.assertEqual(order.status, Order.Status.PENDING)

    def test_rejects_empty_items(self):
        serializer = OrderSerializer(data={"items": []})

        self.assertFalse(serializer.is_valid())
        self.assertIn("items", serializer.errors)

    def test_rejects_duplicate_keys(self):
        serializer = OrderSerializer(
            data={
                "items": [
                    {"key": "bracelet", "quantity": 1},
                    {"key": "bracelet", "quantity": 2},
                ]
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("items", serializer.errors)

    def test_rejects_zero_quantity(self):
        serializer = OrderSerializer(
            data={"items": [{"key": "scarf", "quantity": 0}]}
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("quantity", serializer.errors["items"][0])

    def test_rejects_unknown_product(self):
        serializer = OrderSerializer(
            data={"items": [{"key": "unknown-product", "quantity": 1}]}
        )

        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors["items"][0]["key"][0],
            "Product does not exist.",
        )

    def test_rejects_unknown_variant(self):
        serializer = OrderSerializer(
            data={"items": [{"key": "scarf:rose-red", "quantity": 1}]}
        )

        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors["items"][0]["key"][0],
            "Product variant does not exist.",
        )

    def test_rejects_blank_customer_details(self):
        serializer = OrderSerializer(
            data={
                "email": "",
                "first_name": " ",
                "last_name": "Sharma",
                "address": "123 Main Street",
                "city": "Kathmandu",
                "phone": "9800000000",
                "items": [{"key": "scarf", "quantity": 1}],
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)
        self.assertIn("first_name", serializer.errors)

    def test_rejects_invalid_phone_number(self):
        for phone in ["970000000", "9600000000", "98000000001"]:
            with self.subTest(phone=phone):
                serializer = OrderSerializer(
                    data={
                        "email": "maya@example.com",
                        "first_name": "Maya",
                        "last_name": "Sharma",
                        "address": "123 Main Street",
                        "city": "Kathmandu",
                        "phone": phone,
                        "items": [{"key": "scarf", "quantity": 1}],
                    }
                )

                self.assertFalse(serializer.is_valid())
                self.assertIn("phone", serializer.errors)


class OrderModelTests(TestCase):
    def test_status_defaults_to_pending(self):
        order = Order.objects.create()

        self.assertEqual(order.status, Order.Status.PENDING)
        self.assertEqual(order.get_status_display(), "Pending")

    def test_reference_id_is_unique(self):
        first_order = Order.objects.create()
        second_order = Order.objects.create()

        self.assertNotEqual(first_order.reference_id, second_order.reference_id)

    def test_reference_id_is_read_only_in_order_serializer(self):
        self.assertTrue(OrderSerializer().fields["reference_id"].read_only)

    def test_status_has_expected_choices(self):
        self.assertEqual(
            dict(Order.Status.choices),
            {
                "pending": "Pending",
                "confirmed": "Confirmed",
                "processing": "Processing",
                "shipped": "Shipped",
                "delivered": "Delivered",
                "cancelled": "Cancelled",
            },
        )


class OrderAPITests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        category = Category.objects.create(name="Jewelry")
        product = Product.objects.create(
            name="Bracelet",
            description="A bracelet",
            price="25.00",
            slug="bracelet",
            category=category,
            make=Product.Make.HANDMADE,
        )
        ProductColor.objects.create(
            product=product, name="rose-red", hex="#C8553D"
        )

    def test_creates_order_and_returns_reference_id(self):
        response = self.client.post(
            reverse("order-create"),
            {
                "email": "maya@example.com",
                "first_name": "Maya",
                "last_name": "Sharma",
                "address": "123 Main Street",
                "city": "Kathmandu",
                "phone": "9800000000",
                "latitude": "27.717245",
                "longitude": "85.323961",
                "items": [{"key": "bracelet:rose-red", "quantity": 2}],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertIn("reference_id", response.data)
        self.assertEqual(response.data["email"], "maya@example.com")
        self.assertEqual(response.data["first_name"], "Maya")
        self.assertEqual(response.data["latitude"], "27.717245")
        self.assertEqual(response.data["longitude"], "85.323961")
        self.assertEqual(
            response.data["items"],
            [{"key": "bracelet:rose-red", "quantity": 2}],
        )
        order = Order.objects.get(reference_id=response.data["reference_id"])
        self.assertEqual(order.address, "123 Main Street")
        self.assertEqual(order.city, "Kathmandu")
        self.assertEqual(order.phone, "9800000000")

    def test_creates_order_when_csrf_cookie_is_present(self):
        user = get_user_model().objects.create_user(
            username="checkout-user",
            password="test-password",
        )
        client = APIClient(enforce_csrf_checks=True)
        client.force_login(user)
        client.cookies["csrftoken"] = "present-but-no-header"

        response = client.post(
            reverse("order-create"),
            {
                "email": "maya@example.com",
                "first_name": "Maya",
                "last_name": "Sharma",
                "address": "123 Main Street",
                "city": "Kathmandu",
                "phone": "9800000000",
                "latitude": "27.717245",
                "longitude": "85.323961",
                "items": [{"key": "bracelet:rose-red", "quantity": 2}],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)

    def test_retrieves_order_by_reference_id(self):
        order = Order.objects.create()
        product = Product.objects.get(slug="bracelet")
        OrderItem.objects.create(order=order, product=product, quantity=2)

        response = self.client.get(
            reverse(
                "order-detail", kwargs={"reference_id": order.reference_id}
            )
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["reference_id"], str(order.reference_id))
        self.assertEqual(
            response.data["items"],
            [{"key": "bracelet", "quantity": 2}],
        )

    def test_returns_not_found_for_unknown_reference_id(self):
        response = self.client.get(
            reverse(
                "order-detail",
                kwargs={"reference_id": "00000000-0000-0000-0000-000000000000"},
            )
        )

        self.assertEqual(response.status_code, 404)
