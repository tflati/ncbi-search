"""sra_django_api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from user import views
# from rest_framework import routers, serializers, viewsets

# router = routers.DefaultRouter()
# router.register(r'search', views.search)

urlpatterns = [
#     path('admin/', admin.site.urls),
#     url(r'^api-auth/', include('rest_framework.urls')),
    url('register/', views.register),
    url('login/', views.login),
    url('logout/', views.logout),
    url('create_new_project/', views.create_new_project),
    url('get_projects/(.*)', views.get_projects),
    url('get_project/(.*)/(.*)', views.get_project),
    url('delete_project/', views.delete_project),
    url('save_project/(.*)/(.*)', views.save_project),
]