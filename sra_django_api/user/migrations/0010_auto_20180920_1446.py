# Generated by Django 2.0.3 on 2018-09-20 14:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0009_auto_20180917_1658'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='database',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='project',
            name='search_query_text',
            field=models.CharField(default='', max_length=300),
            preserve_default=False,
        ),
    ]
