# Generated by Django 4.2.16 on 2024-10-08 23:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('direcciones', '0008_remove_comuna_region_comuna_provincia'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ciudad',
            name='region',
        ),
        migrations.AddField(
            model_name='ciudad',
            name='provincia',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='direcciones.provincia'),
        ),
    ]
