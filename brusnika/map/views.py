from django.shortcuts import render
from geopy.geocoders import Nominatim
from .models import Adresses
from rest_framework.decorators import api_view
from .serializers import AdressesSerializer
from rest_framework.response import Response
import json
from django.http import JsonResponse
import requests

def get_coord_data(request):
    adresses = Adresses.objects.all()
    return render(request, 'map/map.html',{'adresses': adresses})

def yandex_maps_view(request):
    adresses = Adresses.objects.all()
    return render(request, 'map/map.html', {'adresses': adresses})

def GetCord(adress):
    loc = Nominatim(user_agent="GetLoc")
    getLoc = loc.geocode(adress)

    coord = f'{getLoc.latitude},{getLoc.longitude}'
    return coord