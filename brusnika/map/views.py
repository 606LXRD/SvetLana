from django.shortcuts import render

def yandex_maps_view(request):
    return render(request, 'map/map.html')
