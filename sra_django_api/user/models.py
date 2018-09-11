from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    affiliation = models.CharField(max_length=500)
    email = models.CharField(max_length=50)
    hashed_password = models.CharField(max_length=200)