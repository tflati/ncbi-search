from django.shortcuts import render
from django.http import HttpResponse
import json
import os
import sys
import time
import glob
from collections import OrderedDict
from xmljson import GData
from xml.etree.ElementTree import fromstring

from Bio import Entrez
from lxml import etree

def init_ncbi_tools():
    Entrez.email = "tiziano.flati@gmail.com"
    Entrez.api_key = "ae48c58f9a840e56ee71d28cb464cc988408"

CACHE_DIR = os.path.dirname(__file__) + "/cache/"
if not os.path.exists(CACHE_DIR):
    os.makedirs(CACHE_DIR)
    
def search(request, parameters):
    
    param_dict = {
        "db": "sra",
        "max_hits": 1000
    }
    fields = parameters.split("&")
    for field in fields:
        key, value = field.split("=")
        param_dict[key] = value
        
    print("PARAMETERS", parameters, param_dict)
    
    record = ""
    cache_file = CACHE_DIR + param_dict["query"] + ".xml"
    if os.path.exists(cache_file):
        print("Loading cached search results from file={}".format(cache_file))
        record = open(cache_file, "r").read()
    else:
        init_ncbi_tools()
         
        handle = Entrez.esearch(retmax=param_dict["max_hits"], db=param_dict["db"], term=param_dict["query"])
        try:
            record = Entrez.read(handle)
        except RuntimeError as e:
            return HttpResponse(json.dumps({"message": str(e)}))
        handle.close()
        
        print(record)
        
        ids = record["IdList"]
        print(len(ids))
        
        handle2 = Entrez.efetch(db=param_dict["db"], id=','.join(ids))
        record = handle2.read()
        handle2.close()
        
        print("Saving search results to cache file={}".format(cache_file))
        open(cache_file, "w").write(record)
        
    bf = GData(dict_type=OrderedDict)
    result = bf.data(fromstring(record))
    
    return HttpResponse(json.dumps(result))


