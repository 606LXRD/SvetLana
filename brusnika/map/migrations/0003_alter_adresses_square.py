# Generated by Django 4.2.7 on 2023-11-22 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0002_rename_yourmodelname_adresses'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adresses',
            name='square',
            field=models.FloatField(),
        ),
    ]
