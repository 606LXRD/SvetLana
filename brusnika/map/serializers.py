from rest_framework import serializers
from .models import Adresses

class AdressesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adresses
        fields = ['id', 'adress', 'price', 'square']





