# Generated by Django 2.0.3 on 2018-09-17 09:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_auto_20180914_1242'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='project_id',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='project',
            name='title',
            field=models.CharField(max_length=100),
        ),
    ]