# Generated by Django 2.0.3 on 2018-09-17 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0007_auto_20180917_1226'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='all_bioprojects',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='project',
            name='all_experiments',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='project',
            name='all_runs',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='project',
            name='all_size',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
