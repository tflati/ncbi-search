# Generated by Django 2.0.3 on 2018-09-21 12:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0010_auto_20180920_1446'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='note',
            field=models.CharField(default='', max_length=16384),
            preserve_default=False,
        ),
    ]
