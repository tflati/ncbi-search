# Generated by Django 2.0.3 on 2018-09-14 12:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_project'),
    ]

    operations = [
        migrations.RenameField(
            model_name='project',
            old_name='file_path',
            new_name='base_path',
        ),
        migrations.AlterField(
            model_name='project',
            name='creation_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]