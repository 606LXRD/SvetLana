# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.yandex_maps_view, name='yandex_maps'),
]
