from django.shortcuts import render

from django.http import HttpResponse
from django.core import serializers
import json
import datetime
import os
import uuid
import shutil
from collections import OrderedDict

from xmljson import GData, Element
from xml.dom import minidom
from xml.etree.ElementTree import fromstring, tostring

from user.models import User, Project
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
        user = User.objects.get(email=email)
        return HttpResponse(json.dumps({"type": "error", "content": "There is already a user registered with this email. Please, use another mail address."}))
    except User.DoesNotExist:
        print("MAIL CHECK SUCCESSFUL DOES NOT EXIST.")
        
        try:
            user = User.objects.get(username=username)
            return HttpResponse(json.dumps({"type": "error", "content": "There is already a user registered with this username. Please choose another username."}))
        except User.DoesNotExist:
            print("USERNAME CHECK SUCCESSFUL DOES NOT EXIST.")
            print("REGISTERING")            
            hashed_password = pbkdf2_sha256.hash(password)
            user = User(username=username, hashed_password=hashed_password, email=email, first_name=first_name, last_name=last_name, affiliation=affiliation).save()
            return HttpResponse(json.dumps({"type": "message", "content": "Registration is complete. User " + username + " correctly added."}))
    
def get_projects(request, username):
    
    u = User.objects.get(username=username)
    projects = u.project_set.all()
    return HttpResponse(serializers.serialize("json", projects, use_natural_foreign_keys=True))

def get_project(request, username, project_id):
    u = User.objects.get(username=username)
    p = Project.objects.get(project_id=project_id, creator=u)

    result = {
        "project": json.loads(serializers.serialize("json", [p], use_natural_foreign_keys=True)),
    }
    
    filepath = p.base_path + "dataset.xml"
    if os.path.exists(filepath):
        bf = GData(dict_type=OrderedDict)
        data_object = fromstring(open(filepath, "r").read())
        dataset = bf.data(data_object)
        
        for exp in dataset["EXPERIMENT_PACKAGE_SET"]["EXPERIMENT_PACKAGE"]:
            run_sets = exp["RUN_SET"]
            print("RUN_SETS", type(run_sets), type(run_sets) is OrderedDict, type(run_sets) is dict)
            if type(run_sets) is OrderedDict: run_sets = [run_sets]
            for run_set in run_sets:
                runs = run_set["RUN"]
                print("RUNS", type(runs))
                if type(runs) is OrderedDict: runs = [runs]
                for run in runs:
                    try:
                        del run["tax_analysis"]
                    except KeyError:
                        pass
        
        result["dataset"] = dataset
    
    filepath = p.base_path + "filters.json"
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            result["filters"] = json.load(f)
    
    return HttpResponse(json.dumps(result))
    
def create_new_project(request):
    
    data = json.loads(request.body.decode("utf-8"))
    username = data["username"]
    title = data["title"]
    
    u = User.objects.get(username=username)
    
    project_id = uuid.uuid4()
    
    base_path = os.path.dirname(__file__) + "/projects/" + username + "/" + title + "/"
    if not os.path.exists(base_path):
        os.makedirs(base_path)
    
    try:
        p = Project.objects.get(title = title, creator=u)
        result = {"type": "error", "content": "A project with title \"" + title + "\" already exists for user " + username}
    except Project.DoesNotExist:
        print("Request project does not exist. Creating one.")
        p = Project(project_id=project_id, title=title, base_path=base_path, creator=u)
        p.save()
        result = {"type": "message", "content": "Correctly created new project with title: " + title + " for user " + username}
    
    return HttpResponse(json.dumps(result))


CACHE_DIR = os.path.dirname(__file__) + "/../sra_django_api/cache/"
def save_project(request, username, project_id):
    
    data = json.loads(request.body.decode("utf-8"))
    
    project = data["project"]
    selection = data["selection"]
    filters = data["filters"]
    
    experiments = []
    exp_tree = {"EXPERIMENT_PACKAGE": experiments}
#     final_dataset_to_save = {"EXPERIMENT_PACKAGE_SET": experiments}
    for p in selection:
        for experiment in p["experiments"]:
            experiments.append(experiment)
    print(len(experiments), "total experiments")
    
    u = User.objects.get(username=username)
    p = Project.objects.get(project_id=project_id, creator=u)
    
    p.no_bioprojects = project["no_bioprojects"]
    p.no_bioprojects_all = project["no_bioprojects_all"]
    p.no_experiments = project["no_experiments"]
    p.no_experiments_all = project["no_experiments_all"]
    p.no_runs = project["no_runs"]
    p.no_runs_all = project["no_runs_all"]
    p.size = project["size"]
    p.size_all = project["size_all"]
    p.search_query_text = project["search_query_text"]
    p.database = project["database"]
    p.note = project["note"]
    p.save()
    
    title = p.title
    
    cache_file = CACHE_DIR + p.search_query_text + ".xml"
    if os.path.exists(cache_file):
        shutil.copyfile(cache_file, p.base_path + "dataset.xml")
#     bf = GData(dict_type=OrderedDict)
#     xml_data = bf.etree(data=exp_tree, root=Element("EXPERIMENT_PACKAGE_SET"))
#     print("Created xml_data")
#     with open(p.base_path + "dataset.xml", "w") as f:
#         s = tostring(xml_data)
#         m = minidom.parseString(s)
#         x = m.toprettyxml(indent="   ")
#         f.write(x)
    
    with open(p.base_path + "filters.json", "w") as f:
       json.dump(filters, f, indent = 4) 
    
    print("Written results to file")
    
    result = {"type": "message", "content": "Correctly saved project with id: " + project_id + " for user " + username}
    
    return HttpResponse(json.dumps(result))

def delete_project(request):
    
    data = json.loads(request.body.decode("utf-8"))
    username = data["username"]
    project_id = data["project_id"]
    
    try:
        u = User.objects.get(username=username)
        p = Project.objects.get(project_id = project_id)
        print(str(p), p.title)
        
        base_path = os.path.dirname(__file__) + "/projects/" + username + "/" + p.title + "/"
        shutil.rmtree(base_path, ignore_errors=True)
    
        p.delete()
        result = {"type": "message", "content": "A project with title \"" + p.title + "\" (project_id=\""+project_id+"\") has been correctly removed"}
    except Project.DoesNotExist as e:
        result = {"type": "error", "content": "Error during the deletion of project " + project_id + ": project not existing (" + str(e) + ")"}
    except Exception as e:
        print("Exception", e)
        result = {"type": "error", "content": "Error during the deletion of project " + project_id + ": " + str(e)}
    
    return HttpResponse(json.dumps(result))
    
    