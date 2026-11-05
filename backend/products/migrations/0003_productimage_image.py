from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0002_category_alter_product_category"),
    ]

    operations = [
        migrations.RenameField(
            model_name="productimage",
            old_name="url",
            new_name="image",
        ),
        migrations.AlterField(
            model_name="productimage",
            name="image",
            field=models.ImageField(upload_to="product_images/"),
        ),
    ]
