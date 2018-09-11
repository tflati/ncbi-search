from django.shortcuts import render

from django.http import HttpResponse
import json

from user.models import User
from passlib.hash import pbkdf2_sha256
import uuid

# Create your views here.
def login(request):
#     data = json.loads(request.body.decode("utf-8"))
#     print(data)
#     if "email" not in data: return HttpResponse(json.dumps({"type": "message", "content": "Please, specify your email."}))
#     email = data["email"]
#     
#     if "password" not in data: return HttpResponse(json.dumps({"type": "message", "content": "Please, specify a password."}))
#     password = data["password"]

    email = "tiziano.flati@gmail.com"
    password = "arc0bal3n0"
    
    try:
        user = User.objects.get(email=email)
        
        if pbkdf2_sha256.verify(password, user.hashed_password):
            response = HttpResponse(json.dumps({"type": "message", "content": "Login successful. Go to <a href='main'>the main page</a>."}))
            response.set_cookie(key='logged_in', value=True)
            response.set_cookie(key='username', value=user.username)
            response.set_cookie(key='login_token', value=uuid.uuid4())
            return response
        else:
            return HttpResponse(json.dumps({"type": "message", "content": "There was an error during the login. Please check your credentials."}))
    
    except User.DoesNotExist:
        return HttpResponse(json.dumps({"type": "message", "content": "This username is not registered. Please <a href='register'>register here</a>."}))
    
def logout(request):
    response = HttpResponse(json.dumps({"type": "message", "content": "You logged out successfully. Go to <a href='main'>the main page</a>."}))
#     response.set_cookie(key='logged_in', value=False)
    response.delete_cookie(key='logged_in')
    response.delete_cookie(key='username')
    response.delete_cookie(key='login_token')
    return response

def register(request):
    data = json.loads(request.body.decode("utf-8"))
    print(data)
    
    if "username" not in data: return HttpResponse(json.dumps({"type": "message", "content": "Please, specify your username."}))
    username = data["username"]
    
    if "email" not in data: return HttpResponse(json.dumps({"type": "message", "content": "Please, specify a valid e-mail address."}))         
    email = data["email"]
    
    if "password" not in data: return HttpResponse(json.dumps({"type": "message", "content": "Please, specify a password."}))
    password = data["password"]
    
    if "repassword" not in data: return HttpResponse(json.dumps({"type": "message", "content": "Please, specify your password twice."}))
    repassword = data["repassword"]
    if password != repassword:
        return HttpResponse(json.dumps({"type": "message", "content": "The two entered passwords do not match. Please make sure you entered the very same password."}))
    
    if "first_name" not in data: return HttpResponse(json.dumps({"type": "message", "content": "Please, specify your first name."}))
    first_name = data["first_name"]
    
    if "last_name" not in data: return HttpResponse(json.dumps({"type": "message", "content": "Please, specify your last name."}))
    last_name = data["last_name"]
    
    if "affiliation" not in data: return HttpResponse(json.dumps({"type": "message", "content": "Please, specify your affiliation."}))
    affiliation = data["affiliation"]
    
#     privacy_policy_agreement = data["privacy_policy_agreement"] if "privacy_policy_agreement" in data else False 
#     if privacy_policy_agreement is False or privacy_policy_agreement == "ALL":
#         return HttpResponse(json.dumps({"type": "message", "content": "Acceptance of privacy policy is mandatory. Go back to <a href='register' target='_self'>the registration page</a>."}))
    
    try:
        user = User.objects.get(username=username)
        return HttpResponse(json.dumps({"type": "message", "content": "This username ('"+username+"') has already been used: please choose another username. Go back to <a href='register' target='_self'>the registration page</a>."}))
    except User.DoesNotExist:
        print("USER DOES NOT EXIST. REGISTERING")
        hashed_password = pbkdf2_sha256.hash(password)
        user = User(username=username, hashed_password=hashed_password, email=email, first_name=first_name, last_name=last_name, affiliation=affiliation).save()
        return HttpResponse(json.dumps({"type": "message", "content": "Registration is complete. User " + username + " correctly added. Go to <a href='login'>the login page to enter the system</a>."}))
    
    
    
    
    