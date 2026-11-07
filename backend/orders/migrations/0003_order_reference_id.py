import uuid

from django.db import migrations, models


def populate_reference_ids(apps, schema_editor):
    Order = apps.get_model("orders", "Order")
    for order in Order.objects.filter(reference_id__isnull=True).iterator():
        order.reference_id = uuid.uuid4()
        order.save(update_fields=["reference_id"])


class Migration(migrations.Migration):
    dependencies = [
        ("orders", "0002_order_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="reference_id",
            field=models.UUIDField(null=True, unique=True),
        ),
        migrations.RunPython(
            populate_reference_ids, migrations.RunPython.noop
        ),
        migrations.AlterField(
            model_name="order",
            name="reference_id",
            field=models.UUIDField(
                default=uuid.uuid4, editable=False, unique=True
            ),
        ),
    ]
