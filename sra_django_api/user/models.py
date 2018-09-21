from django.db import models
import datetime

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    affiliation = models.CharField(max_length=500)
    email = models.CharField(max_length=50)
    hashed_password = models.CharField(max_length=200)
    
    def natural_key(self):
        return {"username": self.username, "name": self.first_name, "surname": self.last_name}
    
class Project(models.Model):
    project_id = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    search_query_text = models.CharField(max_length=300)
    database = models.CharField(max_length=100)
    creation_date = models.DateTimeField(auto_now_add=True)
    base_path = models.CharField(max_length=2000)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    no_bioprojects = models.PositiveIntegerField(default=0)
    no_bioprojects_all = models.PositiveIntegerField(default=0)
    no_experiments = models.PositiveIntegerField(default=0)
    no_experiments_all = models.PositiveIntegerField(default=0)
    no_runs = models.PositiveIntegerField(default=0)
    no_runs_all = models.PositiveIntegerField(default=0)
    size = models.BigIntegerField(default=0)
    size_all = models.PositiveIntegerField(default=0)
    note = models.CharField(max_length=16384)